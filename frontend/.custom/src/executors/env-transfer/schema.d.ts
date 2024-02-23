interface ITransfer {
    from: string;
    to: string;
}

export interface EnvTransferExecutorSchema {
    target: string;
    transfers?: ITransfer[];
    overrides?: Record<string, any>;
} // eslint-disable-line
