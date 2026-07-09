const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Expense = require("../models/Expenses");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const supportedCategories = new Set([
    'Food',
    'Transport',
    'Shopping',
    'Utilities',
    'Health',
    'Education',
    'Entertainment',
    'Rent',
    'Other'
]);

const supportedPaymentModes = new Set(['Cash', 'Card', 'UPI', 'Bank Transfer', 'Other']);

function getMimeType(imagePath) {
    const extension = path.extname(imagePath).toLowerCase();
    if (extension === '.png') return 'image/png';
    if (extension === '.jpg' || extension === '.jpeg') return 'image/jpeg';
    return 'image/jpeg';
}

function safeJsonParse(text) {
    const cleaned = text
        .replace(/```json\s*/gi, '')
        .replace(/```/g, '')
        .trim();

    try {
        return JSON.parse(cleaned);
    } catch (error) {
        const start = cleaned.indexOf('{');
        const end = cleaned.lastIndexOf('}');
        if (start !== -1 && end !== -1 && end > start) {
            return JSON.parse(cleaned.slice(start, end + 1));
        }
        throw error;
    }
}

function normalizeCategory(category) {
    if (!category) return 'Other';
    const matched = String(category).trim();
    return supportedCategories.has(matched) ? matched : 'Other';
}

function normalizePaymentMode(paymentMode) {
    if (!paymentMode) return 'Other';
    const matched = String(paymentMode).trim();
    return supportedPaymentModes.has(matched) ? matched : 'Other';
}

function toNumber(value) {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
}

async function extractTextFromBill(imagePath) {
    try {
        console.log('Starting Gemini bill extraction for file:', imagePath);

        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not configured');
        }

        if (!fs.existsSync(imagePath)) {
            throw new Error(`Image file not found: ${imagePath}`);
        }

        const stats = fs.statSync(imagePath);
        const mimeType = getMimeType(imagePath);
        const imageBase64 = fs.readFileSync(imagePath).toString('base64');

        console.log(`File type: ${mimeType}, Size: ${stats.size} bytes`);

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const prompt = `Extract bill details for the BudgetSync expense form and return ONLY valid JSON.
Do not wrap the response in markdown or code fences.

Return this schema exactly:
{
  "merchant": "store or business name",
  "date": "DD/MM/YYYY or empty string",
  "expenseAmount": 0,
  "GSTNumber": "15 character GSTIN or empty string",
  "BillNumber": "bill or invoice number or empty string",
  "category": "Food|Transport|Shopping|Utilities|Health|Education|Entertainment|Rent|Other",
  "paymentMode": "Cash|Card|UPI|Bank Transfer|Other",
  "items": [{ "name": "item name", "amount": 0 }]
}

Rules:
- Use the final payable total for expenseAmount.
- Use empty string when a string value is not visible.
- Use 0 when a numeric value is not visible.
- Infer category from the receipt content.
- If payment mode is unclear, use "Other".
- Keep items as an empty array if line items are not readable.`;

        const result = await model.generateContent([
            { inlineData: { data: imageBase64, mimeType } },
            prompt
        ]);

        const responseText = result.response.text();
        const parsed = safeJsonParse(responseText);

        const normalizedItems = Array.isArray(parsed.items)
            ? parsed.items
                .map((item) => ({
                    name: typeof item?.name === 'string' ? item.name.trim() : '',
                    amount: toNumber(item?.amount)
                }))
                .filter((item) => item.name || item.amount > 0)
            : [];

        return {
            merchant: typeof parsed.merchant === 'string' ? parsed.merchant.trim() : '',
            date: typeof parsed.date === 'string' ? parsed.date.trim() : '',
            expenseAmount: toNumber(parsed.expenseAmount),
            GSTNumber: typeof parsed.GSTNumber === 'string' ? parsed.GSTNumber.trim() : '',
            BillNumber: typeof parsed.BillNumber === 'string' ? parsed.BillNumber.trim() : '',
            category: normalizeCategory(parsed.category),
            paymentMode: normalizePaymentMode(parsed.paymentMode),
            items: normalizedItems
        };
    } catch (err) {
        console.error('Gemini extraction error:', err.message);
        throw new Error(`Gemini extraction failed: ${err.message}`);
    }
}

async function generateExpenseSummary(userId) {
    try {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const expenses = await Expense.find({
            user: userId,
            createdAt: { $gte: startOfMonth }
        }).sort({ createdAt: -1 });

        if (!expenses.length) {
            return 'No expenses were found for this month yet.';
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `Analyse this user's monthly expenses and give a 3-4 line friendly summary with one saving tip.\n\nExpense data: ${JSON.stringify(expenses)}\n\nKeep it conversational, not robotic.`;

        const result = await model.generateContent(prompt);

        return result.response.text();
    } catch (error) {
        console.error('Expense summary generation error:', error.message);
        throw new Error(`Failed to generate summary: ${error.message}`);
    }
}

module.exports = { extractTextFromBill, generateExpenseSummary };