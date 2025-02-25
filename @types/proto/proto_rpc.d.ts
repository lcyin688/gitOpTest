
declare namespace rpc {

    /** Properties of a C2SAuth. */
    interface IC2SAuth {

        /** C2SAuth accountType */
        accountType?: (number|null);

        /** C2SAuth loginArgs */
        loginArgs?: (rpc.ILoginArgs|null);
    }

    /** Represents a C2SAuth. */
    class C2SAuth implements IC2SAuth {

        /**
         * Constructs a new C2SAuth.
         * @param [properties] Properties to set
         */
        constructor(properties?: rpc.IC2SAuth);

        /** C2SAuth accountType. */
        public accountType: number;

        /** C2SAuth loginArgs. */
        public loginArgs?: (rpc.ILoginArgs|null);

        /**
         * Creates a new C2SAuth instance using the specified properties.
         * @param [properties] Properties to set
         * @returns C2SAuth instance
         */
        public static create(properties?: rpc.IC2SAuth): rpc.C2SAuth;

        /**
         * Encodes the specified C2SAuth message. Does not implicitly {@link rpc.C2SAuth.verify|verify} messages.
         * @param message C2SAuth message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: rpc.IC2SAuth, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified C2SAuth message, length delimited. Does not implicitly {@link rpc.C2SAuth.verify|verify} messages.
         * @param message C2SAuth message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: rpc.IC2SAuth, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a C2SAuth message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns C2SAuth
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): rpc.C2SAuth;

        /**
         * Decodes a C2SAuth message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns C2SAuth
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): rpc.C2SAuth;

        /**
         * Verifies a C2SAuth message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a C2SAuth message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns C2SAuth
         */
        public static fromObject(object: { [k: string]: any }): rpc.C2SAuth;

        /**
         * Creates a plain object from a C2SAuth message. Also converts values to other types if specified.
         * @param message C2SAuth
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: rpc.C2SAuth, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this C2SAuth to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an AuthData. */
    interface IAuthData {

        /** AuthData args */
        args?: (rpc.ILoginArgs|null);

        /** AuthData resp */
        resp?: (rpc.ILoginResp|null);
    }

    /** Represents an AuthData. */
    class AuthData implements IAuthData {

        /**
         * Constructs a new AuthData.
         * @param [properties] Properties to set
         */
        constructor(properties?: rpc.IAuthData);

        /** AuthData args. */
        public args?: (rpc.ILoginArgs|null);

        /** AuthData resp. */
        public resp?: (rpc.ILoginResp|null);

        /**
         * Creates a new AuthData instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AuthData instance
         */
        public static create(properties?: rpc.IAuthData): rpc.AuthData;

        /**
         * Encodes the specified AuthData message. Does not implicitly {@link rpc.AuthData.verify|verify} messages.
         * @param message AuthData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: rpc.IAuthData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AuthData message, length delimited. Does not implicitly {@link rpc.AuthData.verify|verify} messages.
         * @param message AuthData message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: rpc.IAuthData, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AuthData message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AuthData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): rpc.AuthData;

        /**
         * Decodes an AuthData message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AuthData
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): rpc.AuthData;

        /**
         * Verifies an AuthData message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AuthData message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AuthData
         */
        public static fromObject(object: { [k: string]: any }): rpc.AuthData;

        /**
         * Creates a plain object from an AuthData message. Also converts values to other types if specified.
         * @param message AuthData
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: rpc.AuthData, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AuthData to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a S2CAuth. */
    interface IS2CAuth {

        /** S2CAuth result */
        result?: (rpc.AuthResult|null);

        /** S2CAuth accountID */
        accountID?: (string|null);

        /** S2CAuth accountName */
        accountName?: (string|null);

        /** S2CAuth token */
        token?: (string|null);
    }

    /** Represents a S2CAuth. */
    class S2CAuth implements IS2CAuth {

        /**
         * Constructs a new S2CAuth.
         * @param [properties] Properties to set
         */
        constructor(properties?: rpc.IS2CAuth);

        /** S2CAuth result. */
        public result: rpc.AuthResult;

        /** S2CAuth accountID. */
        public accountID: string;

        /** S2CAuth accountName. */
        public accountName: string;

        /** S2CAuth token. */
        public token: string;

        /**
         * Creates a new S2CAuth instance using the specified properties.
         * @param [properties] Properties to set
         * @returns S2CAuth instance
         */
        public static create(properties?: rpc.IS2CAuth): rpc.S2CAuth;

        /**
         * Encodes the specified S2CAuth message. Does not implicitly {@link rpc.S2CAuth.verify|verify} messages.
         * @param message S2CAuth message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: rpc.IS2CAuth, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified S2CAuth message, length delimited. Does not implicitly {@link rpc.S2CAuth.verify|verify} messages.
         * @param message S2CAuth message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: rpc.IS2CAuth, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a S2CAuth message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns S2CAuth
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): rpc.S2CAuth;

        /**
         * Decodes a S2CAuth message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns S2CAuth
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): rpc.S2CAuth;

        /**
         * Verifies a S2CAuth message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a S2CAuth message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns S2CAuth
         */
        public static fromObject(object: { [k: string]: any }): rpc.S2CAuth;

        /**
         * Creates a plain object from a S2CAuth message. Also converts values to other types if specified.
         * @param message S2CAuth
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: rpc.S2CAuth, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this S2CAuth to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a S2CKickOut. */
    interface IS2CKickOut {

        /** S2CKickOut reason */
        reason?: (rpc.KickReason|null);
    }

    /** Represents a S2CKickOut. */
    class S2CKickOut implements IS2CKickOut {

        /**
         * Constructs a new S2CKickOut.
         * @param [properties] Properties to set
         */
        constructor(properties?: rpc.IS2CKickOut);

        /** S2CKickOut reason. */
        public reason: rpc.KickReason;

        /**
         * Creates a new S2CKickOut instance using the specified properties.
         * @param [properties] Properties to set
         * @returns S2CKickOut instance
         */
        public static create(properties?: rpc.IS2CKickOut): rpc.S2CKickOut;

        /**
         * Encodes the specified S2CKickOut message. Does not implicitly {@link rpc.S2CKickOut.verify|verify} messages.
         * @param message S2CKickOut message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: rpc.IS2CKickOut, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified S2CKickOut message, length delimited. Does not implicitly {@link rpc.S2CKickOut.verify|verify} messages.
         * @param message S2CKickOut message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: rpc.IS2CKickOut, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a S2CKickOut message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns S2CKickOut
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): rpc.S2CKickOut;

        /**
         * Decodes a S2CKickOut message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns S2CKickOut
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): rpc.S2CKickOut;

        /**
         * Verifies a S2CKickOut message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a S2CKickOut message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns S2CKickOut
         */
        public static fromObject(object: { [k: string]: any }): rpc.S2CKickOut;

        /**
         * Creates a plain object from a S2CKickOut message. Also converts values to other types if specified.
         * @param message S2CKickOut
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: rpc.S2CKickOut, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this S2CKickOut to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** AuthType enum. */
    enum AuthType {
        AT_Unknown = 0,
        AT_Internal = 1,
        AT_Apple = 2,
        AT_WeiXin = 3,
        AT_Phone = 4,
        AT_HuaWei = 5,
        AT_Oppo = 6,
        AT_WeiXinMG = 7,
        AT_Vivo = 8,
        AT_MI = 9
    }

    /** Properties of a LoginArgs. */
    interface ILoginArgs {

        /** LoginArgs pkg */
        pkg?: (number|null);

        /** LoginArgs authType */
        authType?: (number|null);

        /** LoginArgs token */
        token?: (string|null);

        /** LoginArgs version */
        version?: (string|null);

        /** LoginArgs devType */
        devType?: (number|null);

        /** LoginArgs devDesc */
        devDesc?: (string|null);

        /** LoginArgs did */
        did?: (string|null);

        /** LoginArgs time */
        time?: (number|Long|null);

        /** LoginArgs ip */
        ip?: (string|null);

        /** LoginArgs param */
        param?: (string|null);
    }

    /** Represents a LoginArgs. */
    class LoginArgs implements ILoginArgs {

        /**
         * Constructs a new LoginArgs.
         * @param [properties] Properties to set
         */
        constructor(properties?: rpc.ILoginArgs);

        /** LoginArgs pkg. */
        public pkg: number;

        /** LoginArgs authType. */
        public authType: number;

        /** LoginArgs token. */
        public token: string;

        /** LoginArgs version. */
        public version: string;

        /** LoginArgs devType. */
        public devType: number;

        /** LoginArgs devDesc. */
        public devDesc: string;

        /** LoginArgs did. */
        public did: string;

        /** LoginArgs time. */
        public time: (number|Long);

        /** LoginArgs ip. */
        public ip: string;

        /** LoginArgs param. */
        public param: string;

        /**
         * Creates a new LoginArgs instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LoginArgs instance
         */
        public static create(properties?: rpc.ILoginArgs): rpc.LoginArgs;

        /**
         * Encodes the specified LoginArgs message. Does not implicitly {@link rpc.LoginArgs.verify|verify} messages.
         * @param message LoginArgs message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: rpc.ILoginArgs, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LoginArgs message, length delimited. Does not implicitly {@link rpc.LoginArgs.verify|verify} messages.
         * @param message LoginArgs message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: rpc.ILoginArgs, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LoginArgs message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LoginArgs
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): rpc.LoginArgs;

        /**
         * Decodes a LoginArgs message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LoginArgs
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): rpc.LoginArgs;

        /**
         * Verifies a LoginArgs message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LoginArgs message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LoginArgs
         */
        public static fromObject(object: { [k: string]: any }): rpc.LoginArgs;

        /**
         * Creates a plain object from a LoginArgs message. Also converts values to other types if specified.
         * @param message LoginArgs
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: rpc.LoginArgs, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LoginArgs to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** AuthResult enum. */
    enum AuthResult {
        AR_Fail = 0,
        AR_Ok = 1,
        AR_ConnectionMax = 2,
        AR_DupLogin = 3,
        AR_TokenInvalid = 4,
        AR_ForbidLogin = 5,
        AR_AuthNone = 6,
        AR_LobbyNone = 7,
        AR_VersionErr = 8,
        AR_NotOpen = 9,
        AR_ParamInvalid = 10
    }

    /** Properties of a LoginResp. */
    interface ILoginResp {

        /** LoginResp result */
        result?: (rpc.AuthResult|null);

        /** LoginResp accountType */
        accountType?: (number|null);

        /** LoginResp accountID */
        accountID?: (string|null);

        /** LoginResp accountName */
        accountName?: (string|null);

        /** LoginResp param */
        param?: (string|null);
    }

    /** Represents a LoginResp. */
    class LoginResp implements ILoginResp {

        /**
         * Constructs a new LoginResp.
         * @param [properties] Properties to set
         */
        constructor(properties?: rpc.ILoginResp);

        /** LoginResp result. */
        public result: rpc.AuthResult;

        /** LoginResp accountType. */
        public accountType: number;

        /** LoginResp accountID. */
        public accountID: string;

        /** LoginResp accountName. */
        public accountName: string;

        /** LoginResp param. */
        public param: string;

        /**
         * Creates a new LoginResp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LoginResp instance
         */
        public static create(properties?: rpc.ILoginResp): rpc.LoginResp;

        /**
         * Encodes the specified LoginResp message. Does not implicitly {@link rpc.LoginResp.verify|verify} messages.
         * @param message LoginResp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: rpc.ILoginResp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LoginResp message, length delimited. Does not implicitly {@link rpc.LoginResp.verify|verify} messages.
         * @param message LoginResp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: rpc.ILoginResp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LoginResp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LoginResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): rpc.LoginResp;

        /**
         * Decodes a LoginResp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LoginResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): rpc.LoginResp;

        /**
         * Verifies a LoginResp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LoginResp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LoginResp
         */
        public static fromObject(object: { [k: string]: any }): rpc.LoginResp;

        /**
         * Creates a plain object from a LoginResp message. Also converts values to other types if specified.
         * @param message LoginResp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: rpc.LoginResp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LoginResp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** KickReason enum. */
    enum KickReason {
        KR_DupLogin = 0,
        KR_Forbid = 1
    }

    /** Properties of a A2C_AuthToken. */
    interface IA2C_AuthToken {

        /** A2C_AuthToken result */
        result?: (rpc.AuthResult|null);

        /** A2C_AuthToken args */
        args?: (rpc.ILoginArgs|null);

        /** A2C_AuthToken resp */
        resp?: (rpc.ILoginResp|null);

        /** A2C_AuthToken clientId */
        clientId?: (number|null);

        /** A2C_AuthToken token */
        token?: (string|null);

        /** A2C_AuthToken uid */
        uid?: (number|Long|null);
    }

    /** Represents a A2C_AuthToken. */
    class A2C_AuthToken implements IA2C_AuthToken {

        /**
         * Constructs a new A2C_AuthToken.
         * @param [properties] Properties to set
         */
        constructor(properties?: rpc.IA2C_AuthToken);

        /** A2C_AuthToken result. */
        public result: rpc.AuthResult;

        /** A2C_AuthToken args. */
        public args?: (rpc.ILoginArgs|null);

        /** A2C_AuthToken resp. */
        public resp?: (rpc.ILoginResp|null);

        /** A2C_AuthToken clientId. */
        public clientId: number;

        /** A2C_AuthToken token. */
        public token: string;

        /** A2C_AuthToken uid. */
        public uid: (number|Long);

        /**
         * Creates a new A2C_AuthToken instance using the specified properties.
         * @param [properties] Properties to set
         * @returns A2C_AuthToken instance
         */
        public static create(properties?: rpc.IA2C_AuthToken): rpc.A2C_AuthToken;

        /**
         * Encodes the specified A2C_AuthToken message. Does not implicitly {@link rpc.A2C_AuthToken.verify|verify} messages.
         * @param message A2C_AuthToken message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: rpc.IA2C_AuthToken, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified A2C_AuthToken message, length delimited. Does not implicitly {@link rpc.A2C_AuthToken.verify|verify} messages.
         * @param message A2C_AuthToken message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: rpc.IA2C_AuthToken, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a A2C_AuthToken message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns A2C_AuthToken
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): rpc.A2C_AuthToken;

        /**
         * Decodes a A2C_AuthToken message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns A2C_AuthToken
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): rpc.A2C_AuthToken;

        /**
         * Verifies a A2C_AuthToken message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a A2C_AuthToken message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns A2C_AuthToken
         */
        public static fromObject(object: { [k: string]: any }): rpc.A2C_AuthToken;

        /**
         * Creates a plain object from a A2C_AuthToken message. Also converts values to other types if specified.
         * @param message A2C_AuthToken
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: rpc.A2C_AuthToken, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this A2C_AuthToken to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a A2C_KickLogin. */
    interface IA2C_KickLogin {

        /** A2C_KickLogin account */
        account?: (string|null);

        /** A2C_KickLogin uniConnId */
        uniConnId?: (number|Long|null);

        /** A2C_KickLogin reason */
        reason?: (rpc.KickReason|null);
    }

    /** Represents a A2C_KickLogin. */
    class A2C_KickLogin implements IA2C_KickLogin {

        /**
         * Constructs a new A2C_KickLogin.
         * @param [properties] Properties to set
         */
        constructor(properties?: rpc.IA2C_KickLogin);

        /** A2C_KickLogin account. */
        public account: string;

        /** A2C_KickLogin uniConnId. */
        public uniConnId: (number|Long);

        /** A2C_KickLogin reason. */
        public reason: rpc.KickReason;

        /**
         * Creates a new A2C_KickLogin instance using the specified properties.
         * @param [properties] Properties to set
         * @returns A2C_KickLogin instance
         */
        public static create(properties?: rpc.IA2C_KickLogin): rpc.A2C_KickLogin;

        /**
         * Encodes the specified A2C_KickLogin message. Does not implicitly {@link rpc.A2C_KickLogin.verify|verify} messages.
         * @param message A2C_KickLogin message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: rpc.IA2C_KickLogin, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified A2C_KickLogin message, length delimited. Does not implicitly {@link rpc.A2C_KickLogin.verify|verify} messages.
         * @param message A2C_KickLogin message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: rpc.IA2C_KickLogin, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a A2C_KickLogin message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns A2C_KickLogin
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): rpc.A2C_KickLogin;

        /**
         * Decodes a A2C_KickLogin message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns A2C_KickLogin
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): rpc.A2C_KickLogin;

        /**
         * Verifies a A2C_KickLogin message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a A2C_KickLogin message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns A2C_KickLogin
         */
        public static fromObject(object: { [k: string]: any }): rpc.A2C_KickLogin;

        /**
         * Creates a plain object from a A2C_KickLogin message. Also converts values to other types if specified.
         * @param message A2C_KickLogin
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: rpc.A2C_KickLogin, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this A2C_KickLogin to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a C2A_Logout. */
    interface IC2A_Logout {

        /** C2A_Logout account */
        account?: (string|null);

        /** C2A_Logout token */
        token?: (string|null);

        /** C2A_Logout uniConnId */
        uniConnId?: (number|Long|null);
    }

    /** Represents a C2A_Logout. */
    class C2A_Logout implements IC2A_Logout {

        /**
         * Constructs a new C2A_Logout.
         * @param [properties] Properties to set
         */
        constructor(properties?: rpc.IC2A_Logout);

        /** C2A_Logout account. */
        public account: string;

        /** C2A_Logout token. */
        public token: string;

        /** C2A_Logout uniConnId. */
        public uniConnId: (number|Long);

        /**
         * Creates a new C2A_Logout instance using the specified properties.
         * @param [properties] Properties to set
         * @returns C2A_Logout instance
         */
        public static create(properties?: rpc.IC2A_Logout): rpc.C2A_Logout;

        /**
         * Encodes the specified C2A_Logout message. Does not implicitly {@link rpc.C2A_Logout.verify|verify} messages.
         * @param message C2A_Logout message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: rpc.IC2A_Logout, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified C2A_Logout message, length delimited. Does not implicitly {@link rpc.C2A_Logout.verify|verify} messages.
         * @param message C2A_Logout message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: rpc.IC2A_Logout, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a C2A_Logout message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns C2A_Logout
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): rpc.C2A_Logout;

        /**
         * Decodes a C2A_Logout message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns C2A_Logout
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): rpc.C2A_Logout;

        /**
         * Verifies a C2A_Logout message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a C2A_Logout message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns C2A_Logout
         */
        public static fromObject(object: { [k: string]: any }): rpc.C2A_Logout;

        /**
         * Creates a plain object from a C2A_Logout message. Also converts values to other types if specified.
         * @param message C2A_Logout
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: rpc.C2A_Logout, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this C2A_Logout to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a C2A_Uid2Guid. */
    interface IC2A_Uid2Guid {

        /** C2A_Uid2Guid uid */
        uid?: (number|Long|null);

        /** C2A_Uid2Guid guid */
        guid?: (number|Long|null);
    }

    /** Represents a C2A_Uid2Guid. */
    class C2A_Uid2Guid implements IC2A_Uid2Guid {

        /**
         * Constructs a new C2A_Uid2Guid.
         * @param [properties] Properties to set
         */
        constructor(properties?: rpc.IC2A_Uid2Guid);

        /** C2A_Uid2Guid uid. */
        public uid: (number|Long);

        /** C2A_Uid2Guid guid. */
        public guid: (number|Long);

        /**
         * Creates a new C2A_Uid2Guid instance using the specified properties.
         * @param [properties] Properties to set
         * @returns C2A_Uid2Guid instance
         */
        public static create(properties?: rpc.IC2A_Uid2Guid): rpc.C2A_Uid2Guid;

        /**
         * Encodes the specified C2A_Uid2Guid message. Does not implicitly {@link rpc.C2A_Uid2Guid.verify|verify} messages.
         * @param message C2A_Uid2Guid message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: rpc.IC2A_Uid2Guid, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified C2A_Uid2Guid message, length delimited. Does not implicitly {@link rpc.C2A_Uid2Guid.verify|verify} messages.
         * @param message C2A_Uid2Guid message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: rpc.IC2A_Uid2Guid, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a C2A_Uid2Guid message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns C2A_Uid2Guid
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): rpc.C2A_Uid2Guid;

        /**
         * Decodes a C2A_Uid2Guid message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns C2A_Uid2Guid
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): rpc.C2A_Uid2Guid;

        /**
         * Verifies a C2A_Uid2Guid message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a C2A_Uid2Guid message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns C2A_Uid2Guid
         */
        public static fromObject(object: { [k: string]: any }): rpc.C2A_Uid2Guid;

        /**
         * Creates a plain object from a C2A_Uid2Guid message. Also converts values to other types if specified.
         * @param message C2A_Uid2Guid
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: rpc.C2A_Uid2Guid, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this C2A_Uid2Guid to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Request. */
    interface IRequest {

        /** Request method */
        method?: (string|null);

        /** Request serializedRequest */
        serializedRequest?: (Uint8Array|null);
    }

    /** Represents a Request. */
    class Request implements IRequest {

        /**
         * Constructs a new Request.
         * @param [properties] Properties to set
         */
        constructor(properties?: rpc.IRequest);

        /** Request method. */
        public method: string;

        /** Request serializedRequest. */
        public serializedRequest: Uint8Array;

        /**
         * Creates a new Request instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Request instance
         */
        public static create(properties?: rpc.IRequest): rpc.Request;

        /**
         * Encodes the specified Request message. Does not implicitly {@link rpc.Request.verify|verify} messages.
         * @param message Request message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: rpc.IRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Request message, length delimited. Does not implicitly {@link rpc.Request.verify|verify} messages.
         * @param message Request message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: rpc.IRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Request message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Request
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): rpc.Request;

        /**
         * Decodes a Request message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Request
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): rpc.Request;

        /**
         * Verifies a Request message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Request message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Request
         */
        public static fromObject(object: { [k: string]: any }): rpc.Request;

        /**
         * Creates a plain object from a Request message. Also converts values to other types if specified.
         * @param message Request
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: rpc.Request, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Request to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}