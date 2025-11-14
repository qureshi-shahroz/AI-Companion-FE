# AI Command Protocol - Frontend Integration Guide

## Overview

The AI Companion API uses an **AI Command Protocol** where the AI returns structured JSON commands that control your UI. This is similar to how ChatGPT Tools and Google AI Agents work.

## API Response Format

All responses follow this structure:

```json
{
  "success": true,
  "prompt": "user's prompt",
  "command": {
    "action": "show_component" | "redirect" | "text_reply",
    "component": "ComponentName",  // Only for show_component
    "props": { ... },               // Only for show_component
    "url": "/path",                 // Only for redirect
    "text": "..."                   // Only for text_reply
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Command Types

### 1. Show Component

```json
{
  "action": "show_component",
  "component": "ComponentName",
  "props": { ... }
}
```

### 2. Redirect

```json
{
  "action": "redirect",
  "url": "/some-path"
}
```

### 3. Text Reply

```json
{
  "action": "text_reply",
  "text": "Your response text here"
}
```

## Available Components

### CourseList
Shown when user wants to learn/study.

**Props:**
```typescript
{
  goal: string;
  duration?: string;
  courses: Array<{
    id: number;
    title: string;
    description: string;
    duration: string;
    price: string;
    level: string;
    category: string;
    instructor: string;
    rating: number;
    students: number;
    image: string;
  }>;
}
```

### FinancialPlan
Shown when user has financial goals with amounts/timeframes.

**Props:**
```typescript
{
  goal: string;
  targetAmount: string;
  currency: string;
  timeline: string;
  startDate: string;  // YYYY-MM-DD
  endDate: string;    // YYYY-MM-DD
  dailyTasks: Array<{
    date: string;
    day: number;
    dayOfWeek: string;
    tasks: Array<{
      title: string;
      description: string;
      priority: "high" | "medium" | "low";
      estimatedTime: string;
      category: string;
    }>;
    milestone?: string;
  }>;
  summary: {
    totalDays: number;
    weeklyGoals: string[];
    keyStrategies: string[];
  };
}
```

### TodoPlan30Days
Shown when user wants a daily action plan.

**Props:**
```typescript
{
  goal: string;
  plan: string[];
  startDate: string;
  endDate: string;
}
```

### Roadmap
Shown for long-term planning.

**Props:**
```typescript
{
  goal: string;
  milestones: string[];
}
```

### SuggestionSummary
Shown for recommendations.

**Props:**
```typescript
{
  suggestions: string[];
}
```

## React Implementation Example

```javascript
import { useState } from 'react';

const API_URL = 'http://localhost:3000';

function App() {
  const [command, setCommand] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      setCommand(data.command);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderCommand = () => {
    if (!command) return null;

    switch (command.action) {
      case 'show_component':
        return renderComponent(command.component, command.props);
      
      case 'redirect':
        window.location.href = command.url;
        return <div>Redirecting...</div>;
      
      case 'text_reply':
        return <div className="text-message">{command.text}</div>;
      
      default:
        return <div>Unknown command: {command.action}</div>;
    }
  };

  const renderComponent = (componentName, props) => {
    switch (componentName) {
      case 'CourseList':
        return <CourseListComponent {...props} />;
      
      case 'FinancialPlan':
        return <FinancialPlanComponent {...props} />;
      
      case 'TodoPlan30Days':
        return <TodoPlan30DaysComponent {...props} />;
      
      case 'Roadmap':
        return <RoadmapComponent {...props} />;
      
      case 'SuggestionSummary':
        return <SuggestionSummaryComponent {...props} />;
      
      default:
        return <div>Unknown component: {componentName}</div>;
    }
  };

  return (
    <div className="app">
      <form onSubmit={handleSubmit}>
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask me anything..."
        />
        <button disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>

      {renderCommand()}
    </div>
  );
}
```

## Component Examples

### CourseList Component

```javascript
function CourseListComponent({ goal, duration, courses }) {
  return (
    <div className="course-list">
      <h2>Recommended Courses for: {goal}</h2>
      {duration && <p>Duration: {duration}</p>}
      
      <div className="courses-grid">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <img src={course.image} alt={course.title} />
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <div className="meta">
              <span>⭐ {course.rating}</span>
              <span>👥 {course.students.toLocaleString()}</span>
              <span>💰 {course.price}</span>
            </div>
            <button>Enroll</button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### FinancialPlan Component

```javascript
function FinancialPlanComponent({ goal, targetAmount, currency, timeline, dailyTasks, summary }) {
  return (
    <div className="financial-plan">
      <h2>Goal: {goal}</h2>
      <p>Target: {currency} {targetAmount} in {timeline}</p>
      
      <div className="daily-tasks">
        {dailyTasks.map((day, idx) => (
          <div key={idx} className="day-plan">
            <h3>Day {day.day} - {day.date} ({day.dayOfWeek})</h3>
            {day.milestone && <p className="milestone">{day.milestone}</p>}
            <ul>
              {day.tasks.map((task, taskIdx) => (
                <li key={taskIdx} className={`task priority-${task.priority}`}>
                  <strong>{task.title}</strong>
                  <p>{task.description}</p>
                  <span>{task.estimatedTime} • {task.category}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="summary">
        <h3>Summary</h3>
        <p>Total Days: {summary.totalDays}</p>
        <h4>Weekly Goals:</h4>
        <ul>{summary.weeklyGoals.map((g, i) => <li key={i}>{g}</li>)}</ul>
        <h4>Key Strategies:</h4>
        <ul>{summary.keyStrategies.map((s, i) => <li key={i}>{s}</li>)}</ul>
      </div>
    </div>
  );
}
```

### TodoPlan30Days Component

```javascript
function TodoPlan30DaysComponent({ goal, plan, startDate, endDate }) {
  return (
    <div className="todo-plan">
      <h2>30-Day Plan: {goal}</h2>
      <p>{startDate} to {endDate}</p>
      <ol>
        {plan.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ol>
    </div>
  );
}
```

## Vanilla JavaScript Example

```javascript
async function sendPrompt(prompt) {
  const response = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  const data = await response.json();
  return data.command;
}

// Handle command
function handleCommand(command) {
  switch (command.action) {
    case 'show_component':
      const component = document.createElement('div');
      component.id = 'ai-component';
      document.body.appendChild(component);
      
      // Render component based on command.component
      if (command.component === 'CourseList') {
        renderCourseList(component, command.props);
      } else if (command.component === 'FinancialPlan') {
        renderFinancialPlan(component, command.props);
      }
      break;
    
    case 'redirect':
      window.location.href = command.url;
      break;
    
    case 'text_reply':
      const messageDiv = document.createElement('div');
      messageDiv.textContent = command.text;
      document.body.appendChild(messageDiv);
      break;
  }
}

// Usage
sendPrompt('I want to earn 10k$ in 3 months')
  .then(command => handleCommand(command));
```

## Error Handling

```javascript
try {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  if (data.command) {
    handleCommand(data.command);
  } else {
    console.error('No command in response:', data);
  }
} catch (error) {
  console.error('Error:', error);
  // Show error message to user
}
```

## Key Points

1. **AI controls UI**: The AI decides which component to show based on user intent
2. **Structured commands**: Always JSON, never plain text
3. **Component-based**: Each component has specific props structure
4. **Extensible**: You can add new components - just name them in the AI prompt
5. **Type-safe**: Define TypeScript interfaces for each component's props

## Adding New Components

1. Create the component in your frontend
2. Add it to your `renderComponent` function
3. The AI can now use it by name (it will infer the props structure)

Example:
```javascript
// AI can now use "CustomDashboard" component
case 'CustomDashboard':
  return <CustomDashboardComponent {...props} />;
```

## Testing

```javascript
// Test with different prompts
const testPrompts = [
  'I want to learn web development',        // Should return CourseList
  'I want to earn 10k$ in 3 months',        // Should return FinancialPlan
  'Create a 30-day plan for fitness',       // Should return TodoPlan30Days
  'What is artificial intelligence?'        // Should return text_reply
];

testPrompts.forEach(async (prompt) => {
  const command = await sendPrompt(prompt);
  console.log(`Prompt: ${prompt}`);
  console.log(`Command:`, command);
});
```

