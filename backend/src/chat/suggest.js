import { createAndEmitNotification } from "../libs/notificationService.js";
import prisma from "../libs/prisma.js";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const daysLeft = (endDate) => {
  if (!endDate) return null;
  const now = new Date();
  const end = new Date(endDate);
  // round up partial days
  return Math.ceil((end.getTime() - now.getTime()) / MS_PER_DAY);
};

const formatNearDeadlineBody = (taskName, days) => {
  if (days <= 0) return `🚨 Task "${taskName}" is past its deadline! Time to fix it now!`;
  if (days === 1) return `⚠️ Heads-up! Task "${taskName}" is due tomorrow — give it a final push!`;
  return `⚠️ Reminder: Task "${taskName}" is due in ${days} days. Keep the momentum!`;
};

const formatTaskDoneBody = (taskName, completerName) => {
  return `🎉 Nice job! Task "${taskName}" marked done by ${completerName || 'someone'}. Great work!`;
};

// Send a near-deadline notification to the assigned user (if present)
export const sendNearDeadlineNotification = async (taskId, socketIo = null) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: Number(taskId) },
      include: { assignTo: true }
    });
    if (!task) return null;
    if (task.status === 'DONE') return null;

    const assignedUserId = task.assignTo?.assignedUserId;
    const dl = daysLeft(task.endDate);
    if (dl === null) return null;

    // build a fun/strong body
    const body = formatNearDeadlineBody(task.name, dl);

    if (assignedUserId) {
      const noti = await createAndEmitNotification(prisma, socketIo, {
        header: `Task near deadline`,
        body,
        authorId: Number(assignedUserId),
        type: 'ALERT',
        taskId: Number(task.id),
        projectId: Number(task.projectId)
      });
      return noti;
    }
    return null;
  } catch (error) {
    console.error('sendNearDeadlineNotification error:', error);
    return null;
  }
};

// Send a task-done notification to the task author (project owner/admin)
export const sendTaskDoneNotification = async (taskId, completerId = null, socketIo = null) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: Number(taskId) },
      include: { assignTo: true }
    });
    if (!task) return null;

    const completer = completerId ? await prisma.user.findUnique({ where: { id: Number(completerId) } }) : null;
    const body = formatTaskDoneBody(task.name, completer?.name);

    const noti = await createAndEmitNotification(prisma, socketIo, {
      header: `Task completed`,
      body,
      authorId: Number(task.authorId),
      type: 'ALERT',
      taskId: Number(task.id),
      projectId: Number(task.projectId)
    });
    return noti;
  } catch (error) {
    console.error('sendTaskDoneNotification error:', error);
    return null;
  }
};

// Build a human-friendly reply for common user queries about tasks
// supports: "what tasks today" and "how many days left for <taskId|taskName>"
export const handleUserQuery = async (userId, rawQuery) => {
  try {
    const q = String(rawQuery || '').toLowerCase();
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    if (q.includes('today')) {
      // fetch tasks for which today is between startDate and endDate
      const tasks = await prisma.task.findMany({
        where: {
          AND: [
            {
              OR: [
                { authorId: Number(userId) },
                { assignTo: { assignedUserId: Number(userId) } }
              ]
            },
            { startDate: { lte: endOfDay } },
            { endDate: { gte: startOfDay } }
          ]
        },
        include: { project: true, assignTo: true }
      });

      if (!tasks || tasks.length === 0) return "You have no tasks scheduled for today.";

      const lines = tasks.map(t => {
        const assigned = t.assignTo?.assignedUserId ? 'Assigned' : 'Unassigned';
        const dl = daysLeft(t.endDate);
        return `- ${t.name} (${t.project?.name || 'No project'}) — ${assigned} — ${dl >= 0 ? dl + ' days left' : 'past due'}`;
      });
      return `Here are your tasks for today:\n${lines.join('\n')}`;
    }

    // how many days left for a task
    if (q.includes('how many days') || q.includes('days left') || q.includes('deadline')) {
      // try to extract task id (simple number) from query
      const idMatch = q.match(/(task\s*)?(?:id\s*)?(\d+)/i);
      let foundTask = null;
      if (idMatch) {
        const tid = Number(idMatch[2]);
        foundTask = await prisma.task.findUnique({ where: { id: tid }, include: { project: true } });
      } else {
        // try to extract by name: naive approach — pick last quoted string or trailing words
        const nameMatch = rawQuery.match(/"([^"]+)"/);
        if (nameMatch) {
          foundTask = await prisma.task.findFirst({ where: { name: { contains: nameMatch[1] } }, include: { project: true } });
        }
      }

      if (!foundTask) return "I couldn't find that task. Provide a task id or its exact name in quotes.";
      const dl = daysLeft(foundTask.endDate);
      if (dl === null) return `Task \"${foundTask.name}\" has no deadline set.`;
      if (dl < 0) return `Task \"${foundTask.name}\" was due ${Math.abs(dl)} days ago.`;
      if (dl === 0) return `Task \"${foundTask.name}\" is due today.`;
      return `Task \"${foundTask.name}\" is due in ${dl} days.`;
    }

    // fallback: short helpful developer-style answer summarizing intent
    return "I can tell you today's tasks or how many days left for a task. Try: 'what tasks today' or 'how many days left for task 123'";
  } catch (error) {
    console.error('handleUserQuery error:', error);
    return "Sorry, I couldn't process your request right now.";
  }
};

// also export helpers individually for easier testing
export { daysLeft };

export default {
  daysLeft,
  sendNearDeadlineNotification,
  sendTaskDoneNotification,
  handleUserQuery
};
