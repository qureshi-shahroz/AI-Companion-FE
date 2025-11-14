# Frontend Integration Guide

Complete guide to integrate the AI Companion API into your frontend application.

## API Endpoints

**Base URL:** `http://localhost:3000` (or your deployed URL)

- **POST /api/chat** - Send a prompt and get AI response
- **GET /api/courses** - Get list of available courses
- **GET /api/models** - List available AI models
- **GET /health** - Health check endpoint

## Request Format

```json
{
  "prompt": "Your question or message here"
}
```

## Response Types

The API returns different response types based on the user's intent. All responses include a `responseType` property:

- **`todo_list`** - AI suggests a structured daily action plan
- **`courses`** - AI suggests courses (returns courses array from backend)
- **`text`** - Regular text response
- **`financial_plan`** - Structured JSON plan for financial goals

## Response Formats

### 1. Text Response

```json
{
  "success": true,
  "prompt": "Tell me about AI",
  "responseType": "text",
  "type": "text",
  "response": "AI generated text response",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. Todo List Response

```json
{
  "success": true,
  "prompt": "I want to learn web development",
  "responseType": "todo_list",
  "type": "todo_list",
  "response": "Here's your daily action plan...",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 3. Courses Response

```json
{
  "success": true,
  "prompt": "I want to learn quickly",
  "responseType": "courses",
  "type": "courses",
  "courses": [
    {
      "id": 1,
      "title": "Complete Web Development Bootcamp",
      "description": "Learn full-stack web development...",
      "duration": "12 weeks",
      "price": "$299",
      "level": "Beginner to Advanced",
      "category": "Web Development",
      "instructor": "Dr. Angela Yu",
      "rating": 4.7,
      "students": 500000,
      "image": "https://via.placeholder.com/300x200?text=Web+Dev"
    }
    // ... more courses
  ],
  "aiMessage": "Based on your goal, I recommend these courses...",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 4. Financial Plan Response (Structured JSON)

```json
{
  "success": true,
  "prompt": "I want to earn 10k$ in 3 months",
  "responseType": "todo_list",
  "type": "financial_plan",
  "data": {
    "type": "financial_plan",
    "goal": "earn 10k$ in 3 months",
    "targetAmount": "10000",
    "currency": "USD",
    "timeline": "3 months",
    "startDate": "2024-01-02",
    "endDate": "2024-04-02",
    "dailyTasks": [
      {
        "date": "2024-01-02",
        "day": 1,
        "dayOfWeek": "Tuesday",
        "tasks": [
          {
            "title": "Research income opportunities",
            "description": "Identify 5 potential income streams",
            "priority": "high",
            "estimatedTime": "3 hours",
            "category": "research"
          }
        ],
        "milestone": "Initial research phase"
      }
      // ... more days
    ],
    "summary": {
      "totalDays": 90,
      "weeklyGoals": ["Goal 1", "Goal 2"],
      "keyStrategies": ["Strategy 1", "Strategy 2"]
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Integration Examples

### 1. React Hook with Response Type Handling

```javascript
import { useState } from 'react';

function useAIChat() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendPrompt = async (prompt) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { sendPrompt, loading, error };
}

// Component Usage with Dynamic Rendering
function ChatComponent() {
  const { sendPrompt, loading, error } = useAIChat();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const data = await sendPrompt(input);
      
      // Handle different response types
      let aiMessage;
      
      if (data.responseType === 'financial_plan' || data.type === 'financial_plan') {
        // Render financial plan with daily tasks
        aiMessage = {
          role: 'assistant',
          type: 'financial_plan',
          data: data.data
        };
      } else if (data.responseType === 'courses') {
        // Render courses component
        aiMessage = {
          role: 'assistant',
          type: 'courses',
          courses: data.courses,
          aiMessage: data.aiMessage
        };
      } else if (data.responseType === 'todo_list') {
        // Render todo list component
        aiMessage = {
          role: 'assistant',
          type: 'todo_list',
          content: data.response
        };
      } else {
        // Regular text response
        aiMessage = {
          role: 'assistant',
          type: 'text',
          content: data.response
        };
      }
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const renderMessage = (msg) => {
    switch (msg.type) {
      case 'financial_plan':
        return <FinancialPlanComponent data={msg.data} />;
      case 'courses':
        return <CoursesComponent courses={msg.courses} aiMessage={msg.aiMessage} />;
      case 'todo_list':
        return <TodoListComponent content={msg.content} />;
      default:
        return <div className="text-message">{msg.content}</div>;
    }
  };

  return (
    <div>
      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role}>
            {msg.role === 'user' ? (
              <div>{msg.content}</div>
            ) : (
              renderMessage(msg)
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
```

### 2. Financial Plan Component Example

```javascript
function FinancialPlanComponent({ data }) {
  return (
    <div className="financial-plan">
      <h3>Goal: {data.goal}</h3>
      <p>Timeline: {data.timeline}</p>
      <p>Target: {data.currency} {data.targetAmount}</p>
      
      <div className="daily-tasks">
        <h4>Daily Action Plan</h4>
        {data.dailyTasks.map((day, idx) => (
          <div key={idx} className="day-plan">
            <h5>Day {day.day} - {day.date} ({day.dayOfWeek})</h5>
            {day.milestone && <p className="milestone">{day.milestone}</p>}
            <ul>
              {day.tasks.map((task, taskIdx) => (
                <li key={taskIdx} className={`task priority-${task.priority}`}>
                  <strong>{task.title}</strong>
                  <p>{task.description}</p>
                  <span className="meta">
                    {task.estimatedTime} • {task.category} • Priority: {task.priority}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="summary">
        <h4>Summary</h4>
        <p>Total Days: {data.summary.totalDays}</p>
        <h5>Weekly Goals:</h5>
        <ul>
          {data.summary.weeklyGoals.map((goal, idx) => (
            <li key={idx}>{goal}</li>
          ))}
        </ul>
        <h5>Key Strategies:</h5>
        <ul>
          {data.summary.keyStrategies.map((strategy, idx) => (
            <li key={idx}>{strategy}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

### 3. Courses Component Example

```javascript
function CoursesComponent({ courses, aiMessage }) {
  return (
    <div className="courses-recommendation">
      {aiMessage && (
        <div className="ai-message">
          <p>{aiMessage}</p>
        </div>
      )}
      
      <h3>Recommended Courses</h3>
      <div className="courses-grid">
        {courses.map((course) => (
          <div key={course.id} className="course-card">
            <img src={course.image} alt={course.title} />
            <div className="course-info">
              <h4>{course.title}</h4>
              <p className="description">{course.description}</p>
              <div className="course-meta">
                <span>📚 {course.category}</span>
                <span>⏱️ {course.duration}</span>
                <span>👤 {course.instructor}</span>
                <span>⭐ {course.rating} ({course.students.toLocaleString()} students)</span>
              </div>
              <div className="course-footer">
                <span className="price">{course.price}</span>
                <span className="level">{course.level}</span>
              </div>
              <button className="enroll-btn">Enroll Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 4. Todo List Component Example

```javascript
function TodoListComponent({ content }) {
  return (
    <div className="todo-list-response">
      <div className="ai-text" dangerouslySetInnerHTML={{ __html: content }} />
      {/* Or parse and render as structured todo list if content is structured */}
    </div>
  );
}
```

### 5. Vanilla JavaScript Example

```javascript
async function sendPrompt(prompt) {
  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Handle different response types
    switch (data.responseType) {
      case 'financial_plan':
        renderFinancialPlan(data.data);
        break;
      case 'courses':
        renderCourses(data.courses, data.aiMessage);
        break;
      case 'todo_list':
        renderTodoList(data.response);
        break;
      default:
        renderText(data.response);
    }
    
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Usage
sendPrompt('I want to earn 10k$ in 3 months')
  .then(data => {
    console.log('Response Type:', data.responseType);
  })
  .catch(error => {
    console.error('Failed:', error);
  });
```

## Financial Goal Detection

The API automatically detects financial goals when users mention:
- Earning money (e.g., "earn 10k$ in 3 months")
- Making money
- Income goals
- Financial targets with amounts

**Example:**
```javascript
// This will trigger financial plan generation
sendPrompt('I want to earn 10k$ in 3 months');

// Response will have:
// - responseType: "todo_list"
// - type: "financial_plan"
// - data: { dailyTasks: [...], goal: "...", ... }
```

## Getting Courses Directly

You can also fetch courses directly without sending a prompt:

```javascript
async function getCourses() {
  try {
    const response = await fetch('http://localhost:3000/api/courses');
    const data = await response.json();
    return data.courses;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
}

// Usage
getCourses().then(courses => {
  console.log('Available courses:', courses);
});
```

## Error Handling

```javascript
async function sendPromptWithErrorHandling(prompt) {
  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle API errors
      throw new Error(data.error || 'Request failed');
    }

    return data;
  } catch (error) {
    // Handle network errors or other exceptions
    if (error.name === 'TypeError') {
      console.error('Network error - is the server running?');
    } else {
      console.error('Error:', error.message);
    }
    throw error;
  }
}
```

## Response Type Detection

The API uses intelligent detection to determine the response type:

1. **Explicit markers**: AI includes `RESPONSE_TYPE: todo_list` or `RESPONSE_TYPE: courses` in response
2. **Heuristic detection**: Based on keywords and content structure
3. **Financial goals**: Automatically detected and returns structured JSON plan

## CORS Configuration

CORS is already configured to allow all origins. If you need to restrict it, update the backend:

```javascript
// In index.js
app.use(cors({ origin: 'http://localhost:3001' })); // Specific origin
```

## Environment Variables

For production, use environment variables:

```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
// or for Vite
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

## Complete React Example

```javascript
import { useState } from 'react';

const API_URL = 'http://localhost:3000';

function App() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderResponse = () => {
    if (!response) return null;

    switch (response.responseType) {
      case 'financial_plan':
        return <FinancialPlanComponent data={response.data} />;
      case 'courses':
        return <CoursesComponent courses={response.courses} aiMessage={response.aiMessage} />;
      case 'todo_list':
        return <TodoListComponent content={response.response} />;
      default:
        return <div>{response.response}</div>;
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
      
      {renderResponse()}
    </div>
  );
}
```

## Quick Test

```javascript
// Test the API connection
fetch('http://localhost:3000/health')
  .then(res => res.json())
  .then(data => console.log('API Status:', data))
  .catch(err => console.error('API not available:', err));

// Test financial goal
fetch('http://localhost:3000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt: 'I want to earn 10k$ in 3 months' })
})
  .then(res => res.json())
  .then(data => {
    console.log('Response Type:', data.responseType);
    console.log('Data:', data);
  });
```

## Summary

- Always check `responseType` property to determine how to render the response
- `financial_plan` responses contain structured `data` with `dailyTasks` array
- `courses` responses include `courses` array and `aiMessage`
- `todo_list` responses contain text that can be rendered as a todo list
- `text` responses are regular conversational responses
- Use `/api/courses` endpoint to fetch all available courses directly
