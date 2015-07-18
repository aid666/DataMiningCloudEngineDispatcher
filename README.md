# DataMiningCloud Evaluation

The repo Service and trainer need to be evaluated for testing.

The deployed service and trainer need to be evaluated for using.

The evaluation service will hold a data store to keep the evaluation data for every repo/deploy svc/trainer, the result will come from engine's process but wrapped by the evalutation service.

Every evaluation method is a deployed DMC Flow, for service, it just process the data and compare with the result attribute. For trainer, it will do a cross-validation to test the trainer.
