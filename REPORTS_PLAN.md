# Reports Page Improvements Plan

## Overview
Refactor Reports page for consistency, better visuals, and improved filtering.

---

## 1. Table Layout Consistency

### Current Issue
- Tables wrapped in `Card` > `CardHeader` > `CardContent` (inconsistent with Dashboard/Customers)
- Column headers and rows misaligned

### Solution
**Apply Dashboard/Customers page layout pattern** across all report tables:

#### Target Layout Structure (from Customers.jsx:157-183)
```jsx
<div className="border rounded-lg bg-card">
  <div className="p-6">
    <p className="text-lg font-medium">[Title]</p>
    <p className="pb-3 text-sm text-muted-foreground">[Subtitle]</p>
    <DataTable
      columns={columns}
      data={data}
      filterColumn="..."
      filterPlaceholder="..."
    />
  </div>
</div>
```

### Files to Update
1. **unpaid-bills-report.jsx** (lines 179-193)
   - Remove Card wrapper
   - Add div with border/rounded-lg/bg-card
   - Add p-6 padding div
   - Keep DataTable as is

2. **top-consumers-report.jsx** (lines 186-199)
   - Same refactoring as unpaid-bills-report
   - Add div wrapper with border/rounded-lg/bg-card

3. **revenue-report.jsx** (lines 209-222)
   - Same refactoring pattern

4. **customer-report.jsx** (if it uses Card wrapper)
   - Same refactoring pattern

---

## 2. Bar Chart Colors & Animation

### Issue 2a: Unpaid Bills Bar Chart
**Current Problem:**
- Bar colors are black (not applying utility type colors)
- Current code uses `fill` function on Bar component (lines 161-172) - **this doesn't work in Recharts**
- No animation on chart load

**Solution:**
- **CRITICAL FIX**: Replace `fill` function with `Cell` components inside `Bar`
- Color mapping (matches badge colors):
  - Electricity: `hsl(43, 96%, 56%)` ✓ (yellow)
  - Water: `hsl(217, 91%, 60%)` ✓ (blue)
  - Gas: `hsl(0, 84%, 60%)` ✓ (red)

**Code Fix (unpaid-bills-report.jsx lines 161-172):**
```jsx
// Import Cell at top:
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts'

// Replace Bar component (lines 161-172):
<Bar dataKey="amount" radius={[8, 8, 0, 0]}>
  {data.chartData.map((entry, index) => {
    const colors = {
      Electricity: 'hsl(43, 96%, 56%)',
      Water: 'hsl(217, 91%, 60%)',
      Gas: 'hsl(0, 84%, 60%)',
    }
    return (
      <Cell
        key={`cell-${index}`}
        fill={colors[entry.utilityType] || 'hsl(var(--chart-1))'}
      />
    )
  })}
</Bar>
```

**Add Animation:**
```jsx
<BarChart
  data={data.chartData}
  margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
  isAnimationActive={true}
  animationDuration={800}
>
```

### Issue 2b: Top Consumers Bar Chart
**Current Problem:**
- Bar colors are black (not using customer type colors)
- Current code uses `fill` function on Bar component (lines 168-179) - **this doesn't work in Recharts**
- No animation on chart load

**Badge Colors Found (top-consumers-columns.jsx:54-58):**
- Household: `bg-blue-100 text-blue-800` (light blue badge)
- Business: `bg-purple-100 text-purple-800` (light purple badge)
- Government: `bg-green-100 text-green-800` (light green badge)

**Solution:**
- **CRITICAL FIX**: Replace `fill` function with `Cell` components inside `Bar`
- Use HSL colors that match the badge theme:
  - Household: `hsl(217, 91%, 60%)` (blue - from config line 149)
  - Business: `hsl(271, 91%, 65%)` (purple - from config line 150)
  - Government: `hsl(142, 76%, 36%)` (green - from config line 151)

**Code Fix (top-consumers-report.jsx lines 168-179):**
```jsx
// Import Cell at top:
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts'

// Replace Bar component (lines 168-179):
<Bar dataKey="consumption" radius={[0, 8, 8, 0]}>
  {data.chartData.map((entry, index) => {
    const colors = {
      Household: 'hsl(217, 91%, 60%)',
      Business: 'hsl(271, 91%, 65%)',
      Government: 'hsl(142, 76%, 36%)',
    }
    return (
      <Cell
        key={`cell-${index}`}
        fill={colors[entry.customerType] || 'hsl(var(--chart-1))'}
      />
    )
  })}
</Bar>
```

**Add Animation:**
```jsx
<BarChart
  data={data.chartData}
  layout="vertical"
  margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
  isAnimationActive={true}
  animationDuration={800}
>
```

### Color Sources
- **unpaid-bills-report.jsx**: Lines 144-146 (utility colors)
- **top-consumers-report.jsx**: Lines 149-151 (customer type colors)
- **unpaid-bills-columns.jsx**: Lines 5-16 (utility badge colors)
- **top-consumers-columns.jsx**: Need to check for customer type badge colors

---

## 3. Days Overdue Filter (Unpaid Bills)

### Current State
- Only utility type filter exists (line 27-90)
- Days overdue shown in table but not filterable

### Solution
Add secondary filter dropdown for days overdue ranges:

```jsx
const [daysOverdueFilter, setDaysOverdueFilter] = useState('All')

// In fetch call, include this parameter
const fetchData = async () => {
  try {
    setIsLoading(true)
    const result = await getUnpaidBillsSummary({
      utilityType: utilityFilter,
      daysOverdueRange: daysOverdueFilter  // NEW
    })
    setData(result)
  } catch (error) { ... }
}

// Add new Select in filter row (after utility filter):
<Select value={daysOverdueFilter} onValueChange={setDaysOverdueFilter}>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Days Overdue" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="All">All Days</SelectItem>
    <SelectItem value="0-30">0-30 Days</SelectItem>
    <SelectItem value="31-60">31-60 Days</SelectItem>
    <SelectItem value="60+">60+ Days</SelectItem>
  </SelectContent>
</Select>
```

### Files to Update
1. **unpaid-bills-report.jsx** (lines 27-90)
   - Add daysOverdueFilter state
   - Add filter to useEffect dependency array
   - Add filter parameter to fetchData call
   - Add Select UI component in filter section

2. **reportService.js** (getUnpaidBillsSummary function)
   - Accept daysOverdueRange parameter
   - Filter backend results based on range
   - OR: Let frontend filter the results from backend

---

## Implementation Order (Step-by-step)

### Phase 1: Layout Refactoring (Low Risk)
1. Update unpaid-bills-report.jsx table layout
2. Update top-consumers-report.jsx table layout
3. Update revenue-report.jsx table layout
4. Update customer-report.jsx table layout (if needed)
5. **Test:** Verify tables align with Dashboard/Customers layout

### Phase 2: Chart Colors & Animation (Medium Risk)
1. Verify unpaid bills bar colors apply correctly
2. Add animation to unpaid bills BarChart
3. Verify top consumers bar colors and badge color consistency
4. Fix customer type badge colors if mismatched
5. Add animation to top consumers BarChart
6. **Test:** Check colors match badges, animations play on load

### Phase 3: Days Overdue Filter (Medium Risk)
1. Add daysOverdueFilter state to unpaid-bills-report.jsx
2. Add Select UI for days overdue ranges
3. Update fetchData to include filter parameter
4. Update reportService.js to handle filter (or filter frontend)
5. **Test:** Filter works correctly across utility + days overdue combinations

---

## Files Involved
```
frontend/src/
├── pages/
│   └── Reports.jsx (already correct, just displays components)
├── components/reports/
│   ├── unpaid-bills-report.jsx ⚠️ (1a, 2a, 3)
│   ├── top-consumers-report.jsx ⚠️ (1, 2b)
│   ├── revenue-report.jsx ⚠️ (1)
│   └── customer-report.jsx ⚠️ (1, possibly)
├── components/tables/
│   ├── unpaid-bills-columns.jsx (reference for colors)
│   └── top-consumers-columns.jsx (check for customer type badges)
└── services/
    └── reportService.js ⚠️ (3, if backend filtering needed)
```

---

## Verification Checklist

### Layout
- [ ] Unpaid bills table uses div wrapper (no Card)
- [ ] Top consumers table uses div wrapper (no Card)
- [ ] Revenue table uses div wrapper (no Card)
- [ ] Customer table uses div wrapper (no Card)
- [ ] All tables align with Dashboard/Customers pattern
- [ ] Column headers and rows are properly aligned

### Bar Charts
- [ ] Unpaid bills bars show correct utility colors
- [ ] Top consumers bars show correct customer type colors
- [ ] Unpaid bills chart animates on load
- [ ] Top consumers chart animates on load
- [ ] Animation duration is consistent (800ms)

### Filtering
- [ ] Days overdue filter appears in unpaid bills report
- [ ] Utility + Days overdue filters work together
- [ ] Filter options are correct (All, 0-30, 31-60, 60+)
- [ ] Results update when filters change

---

## Notes
- Keep Card components ONLY for summary stat cards
- Remove Card wrappers from data tables
- Recharts `isAnimationActive` is built-in, no extra library needed
- Color values already exist in code, just need to verify they're being used
- Check if backend supports daysOverdueRange filter or implement frontend filtering
