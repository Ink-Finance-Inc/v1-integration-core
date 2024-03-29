
import {Wallet, Contract} from "ethers";
import {MockProvider} from "ethereum-waffle";
import {keccak256, toUtf8Bytes } from 'ethers/lib/utils';
import { Fixture } from 'ethereum-waffle'
import { waffle, ethers, web3, upgrades } from 'hardhat'
import { FactoryManager } from '../../typechain/FactoryManager'
import { ConfigManager } from '../../typechain/ConfigManager'
import {defaultAbiCoder} from '@ethersproject/abi';
import {FUND_MANAGER_KEY, INK_FUND_KEY, INVESTMENT_UCV_KEY, INVESTMENT_COMMITTEE_KEY, INVESTMENT_UCV_MANAGER_KEY, INVESTMENT_MANAGER_AGENT_KEY, INK_BADGE_KEY,INCOME_MANAGER_SETUP_AGENT_KEY, TREASURY_INCOME_MANAGER_KEY,PROPOSAL_HANDLER_KEY, PAYROLL_SETUP_AGENT_KEY, THE_TREASURY_COMMITTEE_KEY, THE_TREASURY_MANAGER_AGENT_KEY,FACTORY_MANAGER_KEY, PROPOSER_DUTYID, VOTER_DUTYID, INK_CONFIG_DOMAIN, THE_BOARD_COMMITTEE_KEY, THE_PUBLIC_COMMITTEE_KEY, PAYROLL_EXECUTE_AGENT_KEY, PAYROLL_UCV_KEY, PAYROLL_UCV_MANAGER_KEY } from '../shared/fixtures';  
const {loadFixture, deployContract} = waffle;


export function buildPayees(payee1:string, payee2:string, payee3:string, token:string) {
    /*
        struct PayeeInfo {
            address addr;
            address coin;
            uint256 oncePay;
            bytes desc;
    }
    */

    var payees = [];

    payees[0] = web3.eth.abi.encodeParameters(["address", "address", "uint256", "uint256", "uint256", "bytes"], [payee1, token, 20, 100, 0, web3.eth.abi.encodeParameter("string", "desc1" )]);
    payees[1] = web3.eth.abi.encodeParameters(["address", "address", "uint256", "uint256", "uint256", "bytes"], [payee2, token, 20, 100, 0, web3.eth.abi.encodeParameter("string", "desc1" )]);
    payees[2] = web3.eth.abi.encodeParameters(["address", "address", "uint256", "uint256", "uint256", "bytes"], [payee3, token, 20, 100, 0, web3.eth.abi.encodeParameter("string", "desc1" )]);

    return payees;
}


export function buildMasterDAOInitData(erc20Address:string, defaultFlowIndex:number, identity:string) {


        /* 
        MasterDAOInitData
        string name;
        string describe;
        bytes[] mds;
        IERC20 govTokenAddr;
        uint256 govTokenAmountRequirement;
        address stakingAddr;
        string badgeName;
        uint256 badgeTotal;
        // address badgeAddress;
        string daoLogo;
        uint256 minPledgeRequired;
        uint256 minEffectiveVotes;
        uint256 minEffectiveVoteWallets;
        bytes32 factoryManagerKey;
        uint256 defaultFlowIDIndex;
        FlowInfo[] flows;
        bytes32 proposalHandlerKey;
        bytes32 inkBadgeKey;
        address badge;
        bytes[] committees;
        */
        var stakingAddress = erc20Address;
        /*
        struct ProposalCommitteeInfo {
            bytes32 step;
            string committeeFactoryID;
            uint256 sensitive;
            string name;
        }
        */

        var theBoardCommitteeDutyIDsBytesArrary = [];
        theBoardCommitteeDutyIDsBytesArrary[0] = PROPOSER_DUTYID;
        theBoardCommitteeDutyIDsBytesArrary[1] = VOTER_DUTYID;

        var theBoardCommitteeDutyIDs = web3.eth.abi.encodeParameter("bytes32[]", theBoardCommitteeDutyIDsBytesArrary);
        // console.log("board duty bytes----:   ", theBoardCommitteeDutyIDs)
        var thePublicCommitteeDutyIDsByteArray = [];
        thePublicCommitteeDutyIDsByteArray[0] = "0x0000000000000000000000000000000000000000000000000000000000000000";
        var thePublicCommitteeDutyIDs = web3.eth.abi.encodeParameter("bytes32[]", thePublicCommitteeDutyIDsByteArray);
        
        var theBoardAgreeRatio = ethers.utils.parseEther("1");
        var thePublicAgreeRatio = ethers.utils.parseEther("0.5");
        
        /* 
        struct CommitteeCreateInfo {
            string committeeName;
            bytes32 step;
            bytes32 addressConfigKey;
            bytes dutyIDs;
        }
        */
        var committeeInFlowTuple = 'tuple(string, bytes32, bytes32, bytes)';
        var flow0Committees = [];
        flow0Committees[0] = ["The Board", keccak256(toUtf8Bytes("board vote")), THE_BOARD_COMMITTEE_KEY, theBoardCommitteeDutyIDs ];

        var flow1Committees = [];
        flow1Committees[0] = ["The Public", keccak256(toUtf8Bytes("public vote")), THE_PUBLIC_COMMITTEE_KEY, thePublicCommitteeDutyIDs];
        flow1Committees[1] = ["The Board", keccak256(toUtf8Bytes("board vote")), THE_BOARD_COMMITTEE_KEY, theBoardCommitteeDutyIDs]; 

        var flow2Committees = [];
        flow2Committees[0] = ["The Public", keccak256(toUtf8Bytes("public vote")), THE_PUBLIC_COMMITTEE_KEY, thePublicCommitteeDutyIDs]; 


        var flows = [];
        var flowTuple = 'tuple(bytes32, ' + committeeInFlowTuple +'[])';
        // flows[0] = defaultAbiCoder.encode(['tuple(bytes32, ' + proposalTuple +'[])'], [[flowID, committees]]);
        // flows[0] = [keccak256(toUtf8Bytes("0")), committees];
        if (defaultFlowIndex == 0) {
            flows[0] = ["0x0000000000000000000000000000000000000000000000000000000000000000", flow0Committees];
            flows[1] = ["0x0000000000000000000000000000000000000000000000000000000000000001", flow1Committees];
            flows[2] = ["0x0000000000000000000000000000000000000000000000000000000000000002", flow2Committees];
        }

        if (defaultFlowIndex == 1) {

            flows[0] = ["0x0000000000000000000000000000000000000000000000000000000000000001", flow1Committees];
            flows[1] = ["0x0000000000000000000000000000000000000000000000000000000000000002", flow2Committees];
        }

        if (defaultFlowIndex == 2) {
            flows[0] = ["0x0000000000000000000000000000000000000000000000000000000000000002", flow2Committees];
        }
        
        var mds = [];
        mds[0] = web3.eth.abi.encodeParameters(["string", "bytes32", "bytes"], ["content", keccak256(toUtf8Bytes("content1")), "0x00"]);


        var badgeName = "";
        var badgeTotal = ethers.utils.parseEther("10000000");
        var daoLogo = "daoDefaultLogo";

        var minPledgeRequired = 10;
        var minEffectiveVotes = 1;
        var minEffectiveVoteWallets = 1;


        // committee info
        var committesInfo = [];
        // name | committeeKey | dutyIDs
        committesInfo[0] = web3.eth.abi.encodeParameters(["string", "bytes32", "bytes"], ["The Board", THE_BOARD_COMMITTEE_KEY , theBoardCommitteeDutyIDs]);
        committesInfo[1] = web3.eth.abi.encodeParameters(["string", "bytes32", "bytes"], ["The Public", THE_PUBLIC_COMMITTEE_KEY , thePublicCommitteeDutyIDs]);

        var daoAdmin = [];

        daoAdmin[0] = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
        // daoAdmin[1] = "0xed561d037eA9fB2D9DB64639F78A0c393ab22BcF";

        // var daoMembers = [""];
        // daoMembers[0] = "0xf46B1E93aF2Bf497b07726108A539B478B31e64C"
        // daoMembers[1] = "0xed561d037eA9fB2D9DB64639F78A0c393ab22BcF";

        var seats = 1;
        var minIndividalVotes = 5;
        var maxIndividalVotes = 100;

        // staking info
        // stakingAddress(0x00 new staking), 
        // var stakingInfo = web3.eth.abi.encodeParameters(["address", "bytes32", "bytes"], []);

        var tupleSting = ['tuple(string, string, bytes[], address, uint256, address, string, uint256, string, uint256, uint256, uint256, bytes32, uint256,' + flowTuple +'[], bytes32, bytes32, address, bytes[], address[], address[], uint256, uint256, uint256, address)'];
        var tupleData = ["daoName","daoDescribe", mds, erc20Address, 100000, erc20Address, badgeName, badgeTotal, daoLogo, minPledgeRequired, minEffectiveVotes, minEffectiveVoteWallets, FACTORY_MANAGER_KEY, defaultFlowIndex, flows, PROPOSAL_HANDLER_KEY, INK_BADGE_KEY, "0x0000000000000000000000000000000000000000", committesInfo, daoAdmin, [], seats, minIndividalVotes, maxIndividalVotes, identity];
        var masterDAOInitialData = defaultAbiCoder.encode(tupleSting,
             [tupleData]);


        return masterDAOInitialData;
        
}


export function buildFundInitData(erc20Address:string, fundManager:string, riskManager:string) {

    var percentage2 = ethers.utils.parseEther("0.02");


    var fundName = "Fundname";
    var fundDescription = "FundDescription";
    var fundToken = erc20Address;
    var minRaise = ethers.utils.parseEther("1000");
    var maxRaise = ethers.utils.parseEther("10000");

    var timestamp = Date.now();
    var sec = Math.floor(timestamp / 1000);

    var raisedPeriod = 10 ;//60 * 60 * 24 * 5; // 5 days
    var durationOfFund = 2;//60 * 60 * 24 * 30;

    var allowIntermittentDistributions = 0;
    var allowFundTokenized = 1;
    var tokenName = "TestTokenName";
    // var tokenAmount = ethers.utils.parseEther("10000");

    var allowExchange = 1;
    var auditPeriod = 60 * 60 * 24;

    var investmentDomain = 2; // real-world
    var investmentType = 2; // Debt/Loans/Bonds

    var maxSingleExposure = "10000000000000000000";
    var minNumberOfHoldings = "20000000000000000000";
    var maxNavDowndraftFromPeak = "30000000000000000000";
    var maxNavLoss = "40000000000000000000";

    var requireClientBiometricIdentity = 0;
    var requireClientLegalIdentity = 0;


    var fixedFee = percentage2;
    var fixedFeeShouldGoToTreasury = 1;

    var performanceFee = percentage2;
    var performanceFeeShouldGoToTreasury = 1;
    

    var fundManagers = [];
    fundManagers[0] = fundManager;

    var riskManagers = [];
    riskManagers[0] = riskManager;

    var fundInitialData = {
        "fundDeployKey": INK_FUND_KEY,
        "fundName" : fundName,
        "fundDescription" : fundDescription,
        "fundToken": fundToken, 
        "minRaise" : minRaise,
        "maxRaise" : maxRaise,
        "raisedPeriod" : raisedPeriod,
        "durationOfFund" : durationOfFund,
        "allowIntermittentDistributions" : allowIntermittentDistributions,
        "allowFundTokenized" : allowFundTokenized,
        "tokenName" : tokenName,
        // "tokenAmount" : tokenAmount,
        "allowExchange" : allowExchange,
        "auditPeriod" : auditPeriod,
        "investmentDomain" : investmentDomain,
        "investmentType" : investmentType,
        "maxSingleExposure" : maxSingleExposure,
        "minNumberOfHoldings" : minNumberOfHoldings,
        "maxNavDowndraftFromPeak" : maxNavDowndraftFromPeak,
        "maxNavLoss" : maxNavLoss,
        "requireClientBiometricIdentity" : requireClientBiometricIdentity,
        "requireClientLegalIdentity" : requireClientLegalIdentity,
        "fixedFee" : fixedFee,
        "fixedFeeShouldGoToTreasury" : fixedFeeShouldGoToTreasury,
        "performanceFee" : performanceFee,
        "performanceFeeShouldGoToTreasury" : performanceFeeShouldGoToTreasury,
        "minIndividualInvestment" : "0",
        "maxIndividualInvestment" : "1000000000000000000000000",
        "requireHoldBadge" : 0,
        "fundManagers" : fundManagers,
        "riskManagers" : riskManagers,
        "investorKYCs" : ["INK_FINANCE_KYC", "ASTRA_KYC"]
    }


    return fundInitialData;
    
}


export function buildFundInitData2(erc20Address:string, fundManager:string, riskManager:string) {

    var percentage2 = ethers.utils.parseEther("0.1");
    var percentage3 = ethers.utils.parseEther("0.05");


    var fundName = "Fundname";
    var fundDescription = "FundDescription";
    var fundToken = erc20Address;
    var minRaise = ethers.utils.parseEther("100");
    var maxRaise = ethers.utils.parseEther("1000");

    var timestamp = Date.now();
    var sec = Math.floor(timestamp / 1000);

    var raisedPeriod = 10;// 60 * 60 * 24 * 5; // 5 days
    var durationOfFund = 2;

    var allowIntermittentDistributions = 0;
    var allowFundTokenized = 1;
    var tokenName = "TestTokenName";
    // var tokenAmount = ethers.utils.parseEther("10000");

    var allowExchange = 1;
    var auditPeriod = 60 * 60 * 24;

    var investmentDomain = 2; // real-world
    var investmentType = 2; // Debt/Loans/Bonds

    var maxSingleExposure = "10000000000000000000";
    var minNumberOfHoldings = "20000000000000000000";
    var maxNavDowndraftFromPeak = "30000000000000000000";
    var maxNavLoss = "40000000000000000000";

    var requireClientBiometricIdentity = 0;
    var requireClientLegalIdentity = 0;

    

    var fixedFee = percentage2;
    var fixedFeeShouldGoToTreasury = percentage3;

    var performanceFee = percentage2;
    var performanceFeeShouldGoToTreasury = 0;
    

    var fundManagers = [];
    fundManagers[0] = fundManager;

    var riskManagers = [];
    riskManagers[0] = riskManager;

    var fundInitialData = {
        "fundDeployKey": INK_FUND_KEY,
        "fundName" : fundName,
        "fundDescription" : fundDescription,
        "fundToken": fundToken, 
        "minRaise" : minRaise,
        "maxRaise" : maxRaise,
        "raisedPeriod" : raisedPeriod,
        "durationOfFund" : durationOfFund,
        "allowIntermittentDistributions" : allowIntermittentDistributions,
        "allowFundTokenized" : allowFundTokenized,
        "tokenName" : tokenName,
        // "tokenAmount" : tokenAmount,
        "allowExchange" : allowExchange,
        "auditPeriod" : auditPeriod,
        "investmentDomain" : investmentDomain,
        "investmentType" : investmentType,
        "maxSingleExposure" : maxSingleExposure,
        "minNumberOfHoldings" : minNumberOfHoldings,
        "maxNavDowndraftFromPeak" : maxNavDowndraftFromPeak,
        "maxNavLoss" : maxNavLoss,
        "requireClientBiometricIdentity" : requireClientBiometricIdentity,
        "requireClientLegalIdentity" : requireClientLegalIdentity,
        "fixedFee" : fixedFee,
        "fixedFeeShouldGoToTreasury" : fixedFeeShouldGoToTreasury,
        "performanceFee" : performanceFee,
        "performanceFeeShouldGoToTreasury" : performanceFeeShouldGoToTreasury,
        "fundManagers" : fundManagers,
        "riskManagers" : riskManagers,
        "investorKYCs" : ["INK_FINANCE_KYC", "ASTRA_KYC"]
    }


    return fundInitialData;
    
}


export function buildOffchainProposal() {
        // create agent
        var agents = []
        agents[0] = "0x0000000000000000000000000000000000000000000000000000000000000000";
        
        var headers = [];
        headers[0] = {
            "key":  "MinEffectiveVotes",
            "typeID": keccak256(toUtf8Bytes("type.UINT256")),
            "data": web3.eth.abi.encodeParameter("uint256", 99),
            "desc": "0x0002",
        };

        headers[1] = {
            "key":  "MinEffectiveVoteWallets",
            "typeID": keccak256(toUtf8Bytes("type.UINT256")),
            "data": web3.eth.abi.encodeParameter("uint256", 10),
            "desc": toUtf8Bytes(""),
        };

        headers[2] = {
            "key":  "VoteFlow",
            "typeID": keccak256(toUtf8Bytes("type.BYTES32")),
            "data": "0x0000000000000000000000000000000000000000000000000000000000000002",
            "desc": toUtf8Bytes(""),
        };

        headers[3] = {
            "key":  "Expiration",
            "typeID": keccak256(toUtf8Bytes("type.UINT256")),
            "data":  web3.eth.abi.encodeParameter("uint256", 120),
            "desc": toUtf8Bytes(""),
        };

        var kvData = [];
        kvData[0] = web3.eth.abi.encodeParameters(["string","bytes32", "bytes"], ["content", keccak256(toUtf8Bytes("content1")),"0x00"]);
        // kvData[0] = {
        //     "key":  "key",
        //     "typeID": keccak256(toUtf8Bytes("typeID")),
        //     "data": "0x0001",
        //     "desc": "0x0002",
        // };
        var proposal = {
            "agents" : agents,
            "topicID" : keccak256(toUtf8Bytes("topic")),
            "crossChainProtocal":toUtf8Bytes(""),
            "metadata" : headers,
            "kvData" : kvData
        }

        return proposal;
}

export function buildTreasurySetupProposal(operator:string, signer:string, auditor:string, investor:string) {

    var agents = []
    // agent - related duties
    agents[0] = THE_TREASURY_MANAGER_AGENT_KEY;
    
    // agents[1] = toUtf8Bytes("");
    var headers = [];
    headers[0] = {
        "key":  "committeeKey",
        "typeID": THE_TREASURY_COMMITTEE_KEY,
        // "typeID": keccak256(toUtf8Bytes("typeID")),
        "data": THE_TREASURY_COMMITTEE_KEY,
        "desc": "0x0002",
    };
    
    headers[1] = {
        "key":  "ucvKey",
        "typeID": PAYROLL_UCV_KEY,
        // "typeID": keccak256(toUtf8Bytes("typeID")),
        "data": PAYROLL_UCV_KEY,
        "desc": "0x0002",
    }; 

    headers[2] = {
        "key":  "ucvManagerKey",
        "typeID": PAYROLL_UCV_MANAGER_KEY,
        // "typeID": keccak256(toUtf8Bytes("typeID")),
        "data": PAYROLL_UCV_MANAGER_KEY,
        "desc": "0x0002",
    };


    // headers[3] = {
    //     "key":  "VoteFlow",
    //     "typeID": keccak256(toUtf8Bytes("type.BYTES32")),
    //     "data": "0x0000000000000000000000000000000000000000000000000000000000000001",
    //     "desc": toUtf8Bytes(""),
    // };

    // kvData[0] = {
    //     "key":  "key",
    //     "typeID": keccak256(toUtf8Bytes("typeID")),
    //     "data": "0x0001",
    //     "desc": "0x0002",
    // };
    //kvData[0] = web3.eth.abi.encodeParameters(["string","bytes32", "bytes"], ["content", keccak256(toUtf8Bytes("content1")),"0x00"]);
    var kyc = []
    kyc[0] = "ASTRA_BASE_KYC";
    var kycBytes = web3.eth.abi.encodeParameter("string[]", kyc);
    var kvData = [];
    // different roles
    // treasury operator 
    var treasuryOperator = [];
    treasuryOperator[0] = operator;

    var treasuryOperatorBytes = web3.eth.abi.encodeParameters(["address[]", "string[]"], [treasuryOperator, kyc]);
    // // treasury signer
    var treasurySigner = [];
    treasurySigner[0] = signer;
    var treasurySignerBytes = web3.eth.abi.encodeParameters(["address[]", "string[]"], [treasurySigner, kyc]);
    // treasury auditor
    var treasuryAuditor = [];
    treasuryAuditor[0] = auditor;
    var treasuryAuditorBytes = web3.eth.abi.encodeParameters(["address[]", "string[]"], [treasuryAuditor, kyc]);

    var investors = [];
    investors[0] = investor;
    var investorsBytes = web3.eth.abi.encodeParameters(["address[]", "string[]"], [investors, kyc]);




    kvData[0] = web3.eth.abi.encodeParameters(["string","bytes32", "bytes"], ["operators", keccak256(toUtf8Bytes("address")), treasuryOperatorBytes]);
    kvData[1] = web3.eth.abi.encodeParameters(["string","bytes32", "bytes"], ["signer", keccak256(toUtf8Bytes("address")), treasurySignerBytes]);
    kvData[2] = web3.eth.abi.encodeParameters(["string","bytes32", "bytes"], ["auditor", keccak256(toUtf8Bytes("address")), treasuryAuditorBytes]);
    kvData[3] = web3.eth.abi.encodeParameters(["string","bytes32", "bytes"], ["investor", keccak256(toUtf8Bytes("address")), investorsBytes]);


    var proposal = {
        "agents" : agents,
        "topicID" : keccak256(toUtf8Bytes("topic")),
        "crossChainProtocal":toUtf8Bytes(""),
        "metadata" : headers,
        "kvData" : kvData
    }

    return proposal;
}


export function buildInvestmentSetupProposal(fundAdmin:string, fundManager:string, fundRiskManager:string, fundLiquidator:string,  fundAuditor:string) {

    var agents = []
    // agent - related duties
    agents[0] = INVESTMENT_MANAGER_AGENT_KEY;
    
    // agents[1] = toUtf8Bytes("");
    var headers = [];
    headers[0] = {
        "key":  "committeeKey",
        "typeID": INVESTMENT_COMMITTEE_KEY,
        // "typeID": keccak256(toUtf8Bytes("typeID")),
        "data": INVESTMENT_COMMITTEE_KEY,
        "desc": "0x0002",
    };
    
    // headers[1] = {
    //     "key":  "ucvKey",
    //     "typeID": INVESTMENT_UCV_KEY,
    //     // "typeID": keccak256(toUtf8Bytes("typeID")),
    //     "data": INVESTMENT_UCV_KEY,
    //     "desc": "0x0002",
    // }; 

    headers[1] = {
        "key":  "ucvManagerKey",
        "typeID": FUND_MANAGER_KEY,
        // "typeID": keccak256(toUtf8Bytes("typeID")),
        "data": FUND_MANAGER_KEY,
        "desc": "0x0002",
    };


    // headers[3] = {
    //     "key":  "VoteFlow",
    //     "typeID": keccak256(toUtf8Bytes("type.BYTES32")),
    //     "data": "0x0000000000000000000000000000000000000000000000000000000000000001",
    //     "desc": toUtf8Bytes(""),
    // };

    // kvData[0] = {
    //     "key":  "key",
    //     "typeID": keccak256(toUtf8Bytes("typeID")),
    //     "data": "0x0001",
    //     "desc": "0x0002",
    // };
    //kvData[0] = web3.eth.abi.encodeParameters(["string","bytes32", "bytes"], ["content", keccak256(toUtf8Bytes("content1")),"0x00"]);
    var kyc = []
    kyc[0] = "ASTRA_BASE_KYC";
    var kycBytes = web3.eth.abi.encodeParameter("string[]", kyc);


    var kvData = [];
    var fundAdmins = [];
    fundAdmins[0] = fundAdmin;
    var fundAdminBytes = web3.eth.abi.encodeParameters(["address[]", "string[]"], [fundAdmins, kyc]);

    var fundManagers = [];
    fundManagers[0] = fundManager;
    var fundManagersBytes = web3.eth.abi.encodeParameters(["address[]", "string[]"], [fundManagers, kyc]);

    var fundRiskManagers = [];
    fundRiskManagers[0] = fundRiskManager;
    var fundRiskManagersBytes = web3.eth.abi.encodeParameters(["address[]", "string[]"], [fundRiskManagers, kyc]);

    var fundLiquidators = [];
    fundLiquidators[0] = fundLiquidator;
    var fundLiquidatorsBytes = web3.eth.abi.encodeParameters(["address[]", "string[]"], [fundLiquidators, kyc]);

    var fundAuditors = [];
    fundAuditors[0] = fundAuditor;
    var fundAuditorBytes = web3.eth.abi.encodeParameters(["address[]", "string[]"], [fundAuditors, kyc]);

    kvData[0] = web3.eth.abi.encodeParameters(["string","bytes32", "bytes"], ["fundAdmin", keccak256(toUtf8Bytes("address")), fundAdminBytes]);
    kvData[1] = web3.eth.abi.encodeParameters(["string","bytes32", "bytes"], ["fundManager", keccak256(toUtf8Bytes("address")), fundManagersBytes]);
    kvData[2] = web3.eth.abi.encodeParameters(["string","bytes32", "bytes"], ["fundRiskManager", keccak256(toUtf8Bytes("address")), fundRiskManagersBytes]);
    kvData[3] = web3.eth.abi.encodeParameters(["string","bytes32", "bytes"], ["fundLiquidator", keccak256(toUtf8Bytes("address")), fundLiquidatorsBytes]);
    kvData[4] = web3.eth.abi.encodeParameters(["string","bytes32", "bytes"], ["fundAuditor", keccak256(toUtf8Bytes("address")), fundAuditorBytes]);


    var proposal = {
        "agents" : agents,
        "topicID" : keccak256(toUtf8Bytes("topic")),
        "crossChainProtocal":toUtf8Bytes(""),
        "metadata" : headers,
        "kvData" : kvData
    }

    return proposal;
}

/*
export function buildFundSetupProposal(erc20Address:string) {

    var agents = []
    agents[0] = PAYROLL_SETUP_AGENT_KEY;
    
    // agents[1] = toUtf8Bytes("");
    var headers = [];

    // setup member and schedule and payments.
    headers[0] = {
        "key":  "ucvKey",
        "typeID": PAYROLL_UCV_KEY,
        // "typeID": keccak256(toUtf8Bytes("typeID")),
        "data": PAYROLL_UCV_KEY,
        "desc": "0x0002",
    }; 

    headers[1] = {
        "key":  "ucvManagerKey",
        "typeID": PAYROLL_UCV_MANAGER_KEY,
        // "typeID": keccak256(toUtf8Bytes("typeID")),
        "data": PAYROLL_UCV_MANAGER_KEY,
        "desc": "0x0002",
    };

    headers[2] = {
        "key":  "SubCategory",
        "typeID": keccak256(toUtf8Bytes("typeID")),
        "data": web3.eth.abi.encodeParameter("string", "helloSubcategory" ),
        "desc": "0x0002",
    };

    
    // var memberItem = {
    //     addr:  "0xf46B1E93aF2Bf497b07726108A539B478B31e64C",
    //     coin: erc20Address,
    //     oncePay:  10000000,
    //     desc: "payroll",
    // };



    var kvData = [];

    var timestamp = Date.now();
    var sec = Math.floor(timestamp / 1000);
    console.log("now time ################################################################# ", sec);

    // var minRaise = web3.eth.abi.encodeParameter("uint256", ethers.utils.parseEther("10000000"));

    var startTimeBytes = web3.eth.abi.encodeParameter("uint256", (sec - 110));

    // var periodBytes = web3.eth.abi.encodeParameter("uint256", 60*60 );
    var periodBytes = web3.eth.abi.encodeParameter("uint256", 100 );


    // kvData[0] = web3.eth.abi.encodeParameters(["string", "bytes32", "bytes"], ["auditStartTime", keccak256(toUtf8Bytes("uint256")), startTimeBytes]) ;
 
    

    kvData[0] = web3.eth.abi.encodeParameters(["string", "bytes32", "bytes"], ["raisedCurrency", keccak256(toUtf8Bytes("address")), erc20Address]) ;
    // kvData[1] = web3.eth.abi.encodeParameters(["string", "bytes32", "uint256"], ["minRaise", keccak256(toUtf8Bytes("uint256")), minRaise]) ;
    // kvData[2] = web3.eth.abi.encodeParameters(["string", "bytes32", "uint256"], ["maxRaise", keccak256(toUtf8Bytes("uint256")), periodBytes]) ;
    // kvData[3] = web3.eth.abi.encodeParameters(["string", "bytes32", "uint256"], ["raisePeriod", keccak256(toUtf8Bytes("uint256")), claimTimesByte]) ;
    // kvData[4] = web3.eth.abi.encodeParameters(["string", "bytes32", "uint256"], ["fundDuration", keccak256(toUtf8Bytes("uint256")), claimTimesByte]) ;
    // kvData[5] = web3.eth.abi.encodeParameters(["string", "bytes32", "string"], ["raiseTokenName", keccak256(toUtf8Bytes("uint256")), claimTimesByte]) ;
    // kvData[6] = web3.eth.abi.encodeParameters(["string", "bytes32", "uint256"], ["raiseTokenAmount", keccak256(toUtf8Bytes("uint256")), claimTimesByte]) ;
    // kvData[7] = web3.eth.abi.encodeParameters(["string", "bytes32", "uint256"], ["minHold", keccak256(toUtf8Bytes("uint256")), claimTimesByte]) ;

    // 0x0000000000000000000000000000000000000000000000000000000000000000
    // 0x0000000000000000000000000000000000000000000000000000000000000000
    var proposal = {
        "agents" : agents,
        "topicID" : "0x0000000000000000000000000000000000000000000000000000000000000000",
        "crossChainProtocal":toUtf8Bytes(""),
        "metadata" : headers,
        "kvData" : kvData
    }

    return proposal;
}
*/



export function buildPayrollSetupProposal(erc20Address:string, topicID:string) {

    var agents = []
    agents[0] = PAYROLL_SETUP_AGENT_KEY;
    
    // agents[1] = toUtf8Bytes("");
    var headers = [];

    // setup member and schedule and payments.
    headers[0] = {
        "key":  "ucvKey",
        "typeID": PAYROLL_UCV_KEY,
        // "typeID": keccak256(toUtf8Bytes("typeID")),
        "data": PAYROLL_UCV_KEY,
        "desc": "0x0002",
    }; 

    headers[1] = {
        "key":  "ucvManagerKey",
        "typeID": PAYROLL_UCV_MANAGER_KEY,
        // "typeID": keccak256(toUtf8Bytes("typeID")),
        "data": PAYROLL_UCV_MANAGER_KEY,
        "desc": "0x0002",
    };

    headers[2] = {
        "key":  "SubCategory",
        "typeID": keccak256(toUtf8Bytes("typeID")),
        "data": web3.eth.abi.encodeParameter("string", "helloSubcategory" ),
        "desc": "0x0002",
    };

    
    // var memberItem = {
    //     addr:  "0xf46B1E93aF2Bf497b07726108A539B478B31e64C",
    //     coin: erc20Address,
    //     oncePay:  10000000,
    //     desc: "payroll",
    // };


    var memberList = [];
    memberList[0] = ["0xf46B1E93aF2Bf497b07726108A539B478B31e64C", erc20Address, 10000000, "payroll"]; ;

    console.log("start member bytes encode:");
    var memberItemTuple = 'tuple(address, address, uint256, string)[]';
    var memberListBytes = defaultAbiCoder.encode([memberItemTuple],[memberList]);
    // console.log("member bytes:", memberListBytes);

    var kvData = [];

    var timestamp = Date.now();
    var sec = Math.floor(timestamp / 1000);
    console.log("now time ################################################################# ", sec);

    var startTimeBytes = web3.eth.abi.encodeParameter("uint256", (sec - 100));
    var periodBytes = web3.eth.abi.encodeParameter("uint256",5 );
    var claimTimesByte = web3.eth.abi.encodeParameter("uint256",1);

    

    kvData[0] = web3.eth.abi.encodeParameters(["string", "bytes32", "bytes"], ["members", keccak256(toUtf8Bytes("list")), memberListBytes]) ;
    kvData[1] = web3.eth.abi.encodeParameters(["string", "bytes32", "bytes"], ["startTime", keccak256(toUtf8Bytes("uint256")), startTimeBytes]) ;
    kvData[2] = web3.eth.abi.encodeParameters(["string", "bytes32", "bytes"], ["period", keccak256(toUtf8Bytes("uint256")), periodBytes]) ;
    kvData[3] = web3.eth.abi.encodeParameters(["string", "bytes32", "bytes"], ["claimTimes", keccak256(toUtf8Bytes("uint256")), claimTimesByte]) ;
    var memberBytes1 = web3.eth.abi.encodeParameters(["address", "address", "uint256", "string"],["0xf46B1E93aF2Bf497b07726108A539B478B31e64C", erc20Address, 10000000, "payroll"]);
    var memberBytes2 = web3.eth.abi.encodeParameters(["address", "address", "uint256", "string"],["0xf46B1E93aF2Bf497b07726108A539B478B31e64C", erc20Address, 10000000, "payroll"]);

    kvData[4] = web3.eth.abi.encodeParameters(["string", "bytes32", "bytes"], ["payee-0", keccak256(toUtf8Bytes("member")), memberBytes1]) ;
    kvData[5] = web3.eth.abi.encodeParameters(["string", "bytes32", "bytes"], ["payee-1", keccak256(toUtf8Bytes("member")), memberBytes2]) ;

    // 0x0000000000000000000000000000000000000000000000000000000000000000
    // 0x0000000000000000000000000000000000000000000000000000000000000000
    var proposal = {
        "agents" : agents,
        "topicID" : "0x0000000000000000000000000000000000000000000000000000000000000000",
        "crossChainProtocal":toUtf8Bytes(""),
        "metadata" : headers,
        "kvData" : kvData
    }

    return proposal;
}


export function buildIncomeManagementSetupProposal(topicID:string) {

    var agents = []
    agents[0] = INCOME_MANAGER_SETUP_AGENT_KEY;
    
    // agents[1] = toUtf8Bytes("");
    var headers = [];

    // setup member and schedule and payments.
    headers[0] = {
        "key":  "incomeManagerKey",
        "typeID": TREASURY_INCOME_MANAGER_KEY,
        // "typeID": keccak256(toUtf8Bytes("typeID")),
        "data": TREASURY_INCOME_MANAGER_KEY,
        "desc": "0x0002",
    }; 
    

    var kvData = [];
    var timestamp = Date.now();
    var sec = Math.floor(timestamp / 1000);
    console.log("now time ################################################################# ", sec);

    // var startTimeBytes = web3.eth.abi.encodeParameter("uint256", (sec - 60*60*24));
    var startTimeBytes = web3.eth.abi.encodeParameter("uint256", (sec - 110));

    // var periodBytes = web3.eth.abi.encodeParameter("uint256", 60*60 );
    var periodBytes = web3.eth.abi.encodeParameter("uint256", 100 );


    kvData[0] = web3.eth.abi.encodeParameters(["string", "bytes32", "bytes"], ["auditStartTime", keccak256(toUtf8Bytes("uint256")), startTimeBytes]) ;
    kvData[1] = web3.eth.abi.encodeParameters(["string", "bytes32", "bytes"], ["auditPeriod", keccak256(toUtf8Bytes("uint256")), periodBytes]) ;

    // the topic is for reading Auditor
    var proposal = {
        "agents" : agents,
        "topicID" : topicID,
        "crossChainProtocal":toUtf8Bytes(""),
        "metadata" : headers,
        "kvData" : kvData
    }

    return proposal;
}



export function buildPayrollPayProposal(topicID:string, managerAddress:string) {

    var agents = []
    agents[0] = PAYROLL_EXECUTE_AGENT_KEY;
    
    // agents[1] = toUtf8Bytes("");
    var headers = [];

    // setup member and schedule and payments.
    headers[0] = {
        "key":  "committeeKey",
        "typeID": THE_TREASURY_COMMITTEE_KEY,
        // "typeID": keccak256(toUtf8Bytes("typeID")),
        "data": THE_TREASURY_COMMITTEE_KEY,
        "desc": "0x0002",
    };
    
    headers[1] = {
        "key":  "anyKey",
        "typeID": keccak256(toUtf8Bytes("typeID")),
        "data": "0xf46B1E93aF2Bf497b07726108A539B478B31e64C",
        "desc": "0x0002",
    };

    // include vote rule, require all the "signer to vote pass"
    // console.log("start member bytes encode:");
    // var memberItemTuple = 'tuple(address, address, uint256, string)[]';
    // console.log("member bytes:", memberListBytes);


    var signClaimTimes = web3.eth.abi.encodeParameter("uint256", 1);
    var managerAddressBytes = web3.eth.abi.encodeParameter("address", managerAddress);

    console.log("PAYROLL's topicID is ::::: ", topicID);

    var kvData = [];
    kvData[0] = web3.eth.abi.encodeParameters(["string", "bytes32", "bytes"], ["topicID", keccak256(toUtf8Bytes("bytes32")), topicID]) ;
    kvData[1] = web3.eth.abi.encodeParameters(["string", "bytes32", "bytes"], ["approveTimes", keccak256(toUtf8Bytes("uint256")), signClaimTimes]) ;
    kvData[2] = web3.eth.abi.encodeParameters(["string", "bytes32", "bytes"], ["managerAddress", keccak256(toUtf8Bytes("address")), managerAddressBytes]) ;
    // kvData[0] = {
    //     "key":  "key",
    //     "typeID": keccak256(toUtf8Bytes("typeID")),
    //     "data": "0x0001",
    //     "desc": "0x0002",
    // };

    var proposal = {
        "agents" : agents,
        "topicID" : topicID,
        "crossChainProtocal":toUtf8Bytes(""),
        "metadata" : headers,
        "kvData" : kvData
    }

    return proposal;
}