pragma solidity ^0.4.17;
/*
    Election will be conducted on specific time, after that no one will be allowed to vote.
    here owner has the power of allowing a candidate to participate in election which makes the sys
    centeralized (should be avoided). Same for voters registeration
*/
//Deployed at - 0x9d57Fd0F923CCEe9eFd7f4715C64f99a4b877E1A
contract Election{
    
    struct Candidate{
        string partyName;
        string candidateName;
        address candidateAddress;
        uint voteCount;
        string ipfsHash;    //to store logo of candidate
    }
    struct Voter{
        bool authorized;    
        bool voted;
        uint votedTo;
    }
    
    address public owner;
    string public electionName;
    
    
    Candidate[] public candidates;
    mapping(address=>Voter) public voters;
    
    uint public  totalVotes;
    uint public totalVoters;
    uint public totalCandidates;
    
    
    enum State {Campaigning,Voting,Result}
    /*  Campaigning - Candidates can register themselves
        Voting - voters will vote for a Candidate
        Result - the final result will be declared
    */
    State public state;
    
    Candidate public winnigParty;
    address public billContract;
    
    
    event candidateReceipt(string partyName,uint time);
    event receipt(address voterAddress,uint timeOfVote);
    event result(string partyName,address canidateAddress,address contractAddress);
    
    function Election(string name)public payable{
        owner = msg.sender;
        electionName = name;
        totalCandidates=0;
        totalVoters=0;
        totalVotes=0;
        state=State.Campaigning;
    }
    
    modifier ownerOnly(){
        require(msg.sender==owner);
        _;
    }
    
    modifier checkState(State _state){
        require(state == _state);
        _;
    }
    
    
    
    // either allow any one to be a candidate or hand the control to owner
    /*
        candidate should pay some minimal amount to take part in election 
        function addCandidate(string name) checkState(State.Campaigning) payable public {
            require(msg.value>=minimalAmount);
            candidates.push(Candidate(name,0);
        }
    */
    function getBalance()
    view public returns(uint){
        return this.balance;
    }
   
    
    function addCandidate(string partyName,string candidateName,address add,string imageHash) checkState(State.Campaigning)  ownerOnly public{
        candidates.push(Candidate(partyName,candidateName,add,0,imageHash));
        totalCandidates++;
        candidateReceipt(partyName,now);
    }
    
    function changeState(uint index) ownerOnly public{  //will change the state from Campaigning to voting and voting to result
        require(index>=0 && index<3);
        state = State(index);
    }
    
    function addVoter(address person) checkState(State.Campaigning) ownerOnly public{
        voters[person]=Voter(true,false,0);
        totalVoters++;
    }
    
    function voting(uint index) checkState(State.Voting) public{
        require(index>=0 && index<totalCandidates); //verifiying index
        
        require(!voters[msg.sender].voted);         //will check if user has already voted or not, if yes then don't allow him to vote
        require(voters[msg.sender].authorized);     //will check if user is authorized or not , if not then don't allow him to vote
        
        voters[msg.sender].voted=true;
        voters[msg.sender].votedTo = index;
        candidates[index].voteCount++;              //upgrading vote count
        totalVotes++;
        receipt(msg.sender,now);
    }
    
    function results() checkState(State.Result) ownerOnly public{
        uint max=0;
        for(uint i=0;i<totalCandidates;i++){
            if(candidates[max].voteCount < candidates[i].voteCount){
                max=i;
            }
        }
        winnigParty = candidates[max];
        Bill newBill = (new Bill).value(this.balance)(winnigParty.candidateAddress);
        billContract=address(newBill);
        
        //calling event
        result(winnigParty.partyName,winnigParty.candidateAddress,billContract);
    }
    function destroy() ownerOnly public{
        selfdestruct(msg.sender);
    }
}
//get proposalscount
contract Bill{
    struct Bills{
        string name;
        string proposal;
        uint upvotes;
        bool finalized;
    }
    //Transactions done by party
    struct Transactions{
        address to;
        string description;
        uint value;
    }//might not require this in future
    address public owner;
    Transactions[] public transactions;
    Bills[] public bills;
    uint public billsCount;
    uint public totalVoters;
    uint public transCount;
    event billCreationReceipt(string billName,uint timestamp);
    
    modifier ownerOnly(){
        require(msg.sender==owner);
        _;
    }
    modifier billIndex(uint index){
        require(index<bills.length);
        _;
    }
    modifier isNotFinalized(uint index){
        require(!bills[index].finalized);   //only those bills which are not finalized yet
        _;
    }
    
   
    function Bill(address winnigPartyAddress)
    payable
    public{
        owner=winnigPartyAddress;
        billsCount=0;
        totalVoters=5;
        transCount=0;
    }
    function getBalance()
    public view returns(uint){
        return this.balance;
    }
    function proposal(string name,string description) ownerOnly
    public{
        bills.push(Bills(name,description,0,false));
        billsCount++;
        billCreationReceipt(name,now);  //calling event
    }
    function voteBill(uint index,uint vote) billIndex(index) isNotFinalized(index)
    public{
        if(vote==0)
            bills[index].upvotes++;
    }
    function finalizeBill(uint index) billIndex(index) ownerOnly isNotFinalized(index)
    public{
        Bills storage bill = bills[index];
        require(bill.upvotes*2>=totalVoters);
        bill.finalized=true;
    }
    function sendTokens(address to,string description,uint value)ownerOnly  //value should be passed in wei
    public{
        
        require(value<=this.balance);
        transactions.push(Transactions(to,description,value));
        to.transfer(value);
        transCount++;
    }
}