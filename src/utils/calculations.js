// Financial calculation utilities for SpendWise

// Calculate total spent across expenses
export const calculateTotalSpent = (expenses = []) => {
  return expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
};

// Calculate total spent in a specific month/year or period
export const calculateMonthlySpent = (expenses = [], date = new Date()) => {
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();

  return expenses
    .filter(item => {
      if (!item.date) return false;
      const itemDate = new Date(item.date);
      return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear;
    })
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
};

// Calculate totals by Category
export const calculateCategoryTotals = (expenses = []) => {
  const totals = {
    Food: 0,
    Transport: 0,
    Education: 0,
    Shopping: 0,
    Entertainment: 0,
    Recharge: 0,
    Other: 0
  };

  expenses.forEach(item => {
    const cat = item.category || 'Other';
    const amount = Number(item.amount) || 0;
    if (totals[cat] !== undefined) {
      totals[cat] += amount;
    } else {
      totals.Other += amount;
    }
  });

  return totals;
};

// Calculate weekly spending totals for the past 7 days
export const calculateWeeklySpent = (expenses = []) => {
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);

  return expenses
    .filter(item => {
      if (!item.date) return false;
      const itemDate = new Date(item.date);
      return itemDate >= sevenDaysAgo && itemDate <= now;
    })
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
};

// Calculate daily average spending over active days (or over month)
export const calculateDailyAverage = (expenses = []) => {
  if (!expenses.length) return 0;
  
  // Find date range span
  const timestamps = expenses
    .map(e => new Date(e.date || e.createdAt).getTime())
    .filter(t => !isNaN(t));

  if (!timestamps.length) return 0;

  const minDate = new Date(Math.min(...timestamps));
  const maxDate = new Date();
  
  // Difference in days (minimum 1 day)
  const diffTime = Math.max(1, Math.abs(maxDate - minDate));
  const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const total = calculateTotalSpent(expenses);
  return Math.round(total / diffDays);
};

// Group expenses by Day / Week for Recharts line/bar visual
export const prepareSpendingTrendData = (expenses = []) => {
  const dayMap = {};
  const last7Days = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
    dayMap[dateStr] = { name: label, date: dateStr, amount: 0 };
    last7Days.push(dateStr);
  }

  expenses.forEach(item => {
    if (item.date && dayMap[item.date]) {
      dayMap[item.date].amount += Number(item.amount) || 0;
    }
  });

  return last7Days.map(dateStr => dayMap[dateStr]);
};

// Insights Generator - strict deterministic calculations
export const generateInsights = (expenses = [], monthlyBudget = 10000, categoryBudgets = {}) => {
  if (expenses.length < 3) {
    return {
      hasData: false,
      message: 'Add more expenses to unlock meaningful insights.'
    };
  }

  const categoryTotals = calculateCategoryTotals(expenses);
  const totalSpent = calculateTotalSpent(expenses);
  const weeklySpent = calculateWeeklySpent(expenses);
  const dailyAvg = calculateDailyAverage(expenses);

  // Highest spending category
  const sortedCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1]);

  const topCategory = sortedCategories[0] || ['Food', 0];
  const top3Categories = sortedCategories.filter(([_, val]) => val > 0).slice(0, 3);

  // Compare last 7 days vs prior 7 days
  const now = new Date();
  const d7 = new Date(now); d7.setDate(now.getDate() - 7);
  const d14 = new Date(now); d14.setDate(now.getDate() - 14);

  const thisWeekTotal = expenses
    .filter(e => new Date(e.date) >= d7)
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const prevWeekTotal = expenses
    .filter(e => new Date(e.date) >= d14 && new Date(e.date) < d7)
    .reduce((sum, e) => sum + Number(e.amount), 0);

  let weekComparison = null;
  if (prevWeekTotal > 0) {
    const diffPercent = Math.round(((thisWeekTotal - prevWeekTotal) / prevWeekTotal) * 100);
    weekComparison = {
      percent: Math.abs(diffPercent),
      increased: diffPercent > 0,
      diffAmount: Math.abs(thisWeekTotal - prevWeekTotal)
    };
  }

  // Budget status warning flags
  const percentUsed = Math.min(100, Math.round((totalSpent / monthlyBudget) * 100));

  return {
    hasData: true,
    topCategory: { name: topCategory[0], amount: topCategory[1] },
    top3Categories,
    weeklySpent,
    dailyAvg,
    totalSpent,
    percentUsed,
    weekComparison,
    categoryTotals
  };
};

// SpendWise AI Query Processor (Deterministic Analytics Engine)
export const processAIQuery = (query, expenses = [], budgetData = {}, currency = '₹') => {
  const q = query.toLowerCase().trim();
  const { monthlyBudget = 10000, categoryBudgets = {} } = budgetData;

  if (expenses.length === 0) {
    return "I don't have enough spending data yet. Please add a few expenses or load demo data to unlock AI insights.";
  }

  const totalSpent = calculateTotalSpent(expenses);
  const remaining = Math.max(0, monthlyBudget - totalSpent);
  const categoryTotals = calculateCategoryTotals(expenses);
  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  const dailyAvg = calculateDailyAverage(expenses);
  const weeklySpent = calculateWeeklySpent(expenses);

  if (q.includes('most') || q.includes('highest') || q.includes('where am i spending')) {
    const [topCat, topAmount] = sortedCategories[0] || ['Food', 0];
    const catBudget = categoryBudgets[topCat] || 0;
    const catPercent = catBudget ? Math.round((topAmount / catBudget) * 100) : 0;
    
    return `Your highest spending category is **${topCat}** with a total of **${currency}${topAmount.toLocaleString('en-IN')}** logged.` +
      (catBudget ? ` You've used **${catPercent}%** of your ${topCat} category budget.` : '');
  }

  if (q.includes('spent this month') || q.includes('total spent') || q.includes('how much have i spent')) {
    const percent = Math.round((totalSpent / monthlyBudget) * 100);
    return `You have spent **${currency}${totalSpent.toLocaleString('en-IN')}** so far out of your **${currency}${monthlyBudget.toLocaleString('en-IN')}** monthly budget (${percent}% used). You have **${currency}${remaining.toLocaleString('en-IN')}** remaining.`;
  }

  if (q.includes('per day') || q.includes('daily') || q.includes('can i spend')) {
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const daysLeft = Math.max(1, daysInMonth - today.getDate() + 1);
    const safeDaily = Math.round(remaining / daysLeft);

    return `Based on your remaining monthly budget of **${currency}${remaining.toLocaleString('en-IN')}** over the next **${daysLeft} days**, your recommended daily limit is **${currency}${safeDaily.toLocaleString('en-IN')}/day**. Your current average daily spending is **${currency}${dailyAvg.toLocaleString('en-IN')}**.`;
  }

  if (q.includes('watch') || q.includes('category') || q.includes('risk') || q.includes('exceed')) {
    // Check categories closest to budget limit
    const riskCategories = Object.entries(categoryBudgets)
      .map(([cat, bAmt]) => {
        const spent = categoryTotals[cat] || 0;
        const p = bAmt ? (spent / bAmt) * 100 : 0;
        return { cat, spent, bAmt, percent: Math.round(p) };
      })
      .sort((a, b) => b.percent - a.percent);

    const highestRisk = riskCategories[0];
    if (highestRisk && highestRisk.percent > 70) {
      return `Keep a close eye on **${highestRisk.cat}**! You've used **${highestRisk.percent}%** of its budget (${currency}${highestRisk.spent}/${currency}${highestRisk.bAmt}).`;
    }
    return `Your category spending is well-balanced right now! **${sortedCategories[0][0]}** is your largest expense area (${currency}${sortedCategories[0][1]}).`;
  }

  if (q.includes('summarize') || q.includes('summary') || q.includes('overview')) {
    const top3 = sortedCategories.filter(([_, amt]) => amt > 0).slice(0, 3).map(([c, a]) => `${c} (${currency}${a})`).join(', ');
    return `### SpendWise Spending Summary\n` +
      `- **Total Spent:** ${currency}${totalSpent.toLocaleString('en-IN')}\n` +
      `- **Remaining Budget:** ${currency}${remaining.toLocaleString('en-IN')}\n` +
      `- **Top Categories:** ${top3 || 'None'}\n` +
      `- **Average Daily Spending:** ${currency}${dailyAvg.toLocaleString('en-IN')}\n` +
      `- **7-Day Total:** ${currency}${weeklySpent.toLocaleString('en-IN')}`;
  }

  // Fallback response for unhandled prompts
  return `Here is what I found from your current local data:\n\n` +
    `You have recorded **${expenses.length} transactions** totaling **${currency}${totalSpent.toLocaleString('en-IN')}**.\n` +
    `Your top spending area is **${sortedCategories[0] ? sortedCategories[0][0] : 'N/A'}**.\n\n` +
    `*Tip: Try asking "Where am I spending the most?", "How much can I spend per day?", or "Summarize my spending".*`;
};
