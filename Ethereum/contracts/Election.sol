pragma solidity ^0.4.17;
/*
    Election will be conducted on specific time, after that no one will be allowed to vote.
    here owner has the power of allowing a candidate to participate in election which makes the sys
    centeralized (should be avoided). Same for voters registeration
*/
//Deployed at - 0x9d57Fd0F923CCEe9eFd7f4715C64f99a4b877E1A
contract Election{
    
    address public owner;
    string public electionName;
    
    struct Candidate{
        string name;
        uint voteCount;
    }
    struct Voter{
        bool authorized;
        bool voted;
        uint votedTo;
    }
    
    Candidate[] public candidates;
    mapping(address=>Voter) public voters;
    
    uint public  totalVotes;
    uint public totalVoters;
    uint public totalCandidates;
    
    event candidateReceipt(string partyName,uint time);
    event receipt(address voterAddress,uint timeOfVote);
    
    enum State {Campaigning,Voting,Result}
    /*  Campaigning - Candidates can register themselves
        Voting - voters will vote for a Candidate
        Result - the final result will be declared
    */
    State public state;
    
    
    function Election(string name)public{
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
    function addCandidate(string name) checkState(State.Campaigning)  ownerOnly public{
        candidates.push(Candidate(name,0));
        totalCandidates++;
        candidateReceipt(name,now);
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
    
    function results() checkState(State.Result) view ownerOnly public returns(string){
            uint max=0;
            for(uint i =0 ;i<candidates.length;i++){
                if(candidates[max].voteCount<candidates[i].voteCount){
                    max=i;
                }
            }            
            return candidates[max].name;
    }
    function destroy() ownerOnly public{
        selfdestruct(msg.sender);
    }
}