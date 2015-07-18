# DataMiningCloud Engine Dispatcher

Dispatcher is the controller of a running process.

It will response to a running request via a ReST API to create a process instance.

This dispatcher depends on a consul which offer the engine services registry.

This dispatcher will dispatch task to an engine service based on the task's algorithm.

An engine service will dispatch a finished event to this dispatcher when it finished the job.
