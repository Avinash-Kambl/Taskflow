const Task = require('../models/Task');
const Project = require('../models/Project');

const isMember = (project, userId) =>
  project.owner.toString() === userId.toString() ||
  project.members.some((m) => m.user.toString() === userId.toString());

// @desc    Get tasks for a project
// @route   GET /api/tasks/project/:projectId
// @access  Private
const getTasksByProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    if (!isMember(project, req.user._id))
      return res.status(403).json({ success: false, message: 'Access denied' });

    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignee', 'name email')
      .populate('createdBy', 'name email')
      .sort({ order: 1, createdAt: -1 });

    res.json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assigneeId, status, priority, dueDate, tags } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    if (!isMember(project, req.user._id))
      return res.status(403).json({ success: false, message: 'Access denied' });

    const task = await Task.create({
      title,
      description,
      project: projectId,
      assignee: assigneeId || null,
      createdBy: req.user._id,
      status: status || project.columns[0],
      priority,
      dueDate,
      tags,
    });

    await task.populate('assignee createdBy', 'name email');
    res.status(201).json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('project');
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    if (!isMember(task.project, req.user._id))
      return res.status(403).json({ success: false, message: 'Access denied' });

    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('assignee createdBy', 'name email');

    res.json({ success: true, task: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('project');
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    if (!isMember(task.project, req.user._id))
      return res.status(403).json({ success: false, message: 'Access denied' });

    await task.deleteOne();
    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update task status (drag-and-drop)
// @route   PATCH /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res) => {
  try {
    const { status, order } = req.body;
    const task = await Task.findById(req.params.id).populate('project');
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    if (!isMember(task.project, req.user._id))
      return res.status(403).json({ success: false, message: 'Access denied' });

    task.status = status;
    if (order !== undefined) task.order = order;
    await task.save();
    await task.populate('assignee createdBy', 'name email');

    res.json({ success: true, task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getTasksByProject, createTask, updateTask, deleteTask, updateTaskStatus };
