# Task Dispatcher

Dispatcher is the controller of a running process. It will have several executors which can run a flow in it.

It will monitor a waiting queue of flow from HUB, to create a process instance when there is any executor is empty.

This dispatcher depends on a consul which offer the engine services registry.

This dispatcher will dispatch task to some engine agents based on the task's algorithm.

An engine service will dispatch a finished event to this dispatcher when it finished the job. And the dispatcher will check the flow to determine next task of this flow or finished.

# Executor
Executor is a logic unit which including the process flow instance, its execution tasks and data store.

# Task
The execution of the process flow instance is a collection of tasks. A task means an engine agent, which present an algorithm, using a model as its parameter, to process data. Task result will be POST to the dispatcher.
