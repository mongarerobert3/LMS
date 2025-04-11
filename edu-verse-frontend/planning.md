
The current implementation renders badges in a small toast, but we want to rework this to create a powerful, motivational, and visually stunning experience for the user.

🎯 TASK: Implement a **badge display system** with the following features:

---

### 🥇 1. **Badge Unlock Modal (Center of Screen)**

- When a user unlocks a badge:
  - Show a **centered modal** with:
    - A **moderately large badge image/icon** .
    - A **motivational message** (e.g., “✨ Congratulations, you completed a 7-day streak! Keep shining 🙌”).
    - Title and short description.
  - Add a **subtle blurred background** while the modal is active.
  - Include a small `×` (close) icon in the **top-right** to dismiss the modal.
    - When clicked, **remove the blur** and return to the dashboard or active course.

---

### 📈 2. **Badge Count in Course Progress Section**

- In the user’s dashboard (or course progress overview):
  - Next to the “Assignments” section, add a **badge icon with a counter**.
  - This counter shows how many badges the user has earned.
  - Clicking this icon opens a **toast-like scrollable panel** showing:
    - A **vertical list** of earned badges with:
      - Badge image
      - Title
      - Short message
      - `📤 Share` button (mocked for now)

---

### 🛠 3. **Implementation Notes**

- Store badge data in `UserContext` as mock data (as backend isn’t ready yet).
- Design should feel warm, spiritual, and rewarding.
- Style badges with **rounded gold/silver trims**, **soft gradients**, and **encouraging messages**.
- Ensure the badge modal feels like a **celebration** — a moment of achievement.
- Use any spiritual affirmations or Bible verse references to add depth to the congratulatory messages.

