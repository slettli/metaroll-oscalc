let adminArray = [];
let userArray = [];
let OSMAX = 40; // Max OS score before GOD smites you
let OS = 0; // The decker's OS score
let ROUNDS = 0;
let PROGRAMS = 0; // Number of illegal programs used per actions
let HITS = 0; // Total opposed hits on illegal actions
let UNTILGOD = "???";
let NUMADMINS = 0;
let NUMUSERS = 0;

// Runs each rounds and does necessary calculations
// This should be split up more for organizing
const RoundCalculator = (() => {

    const _newRound = () => {
        _calculateOS();
        _updateRounds();
        ROUNDS++;
    };
    
    const _calculateOS = () => {
        let totalUsers = _getTotalUsers();
        let adminOS = totalUsers[0];
        adminOS = adminOS * 3;
        let userOS = totalUsers[1];
        OS = OS + adminOS + userOS; // Add to OS

        let remainingOS = 40 - OS;
        
        let tmp = adminOS + userOS;
        if (tmp > 0){
            UNTILGOD = remainingOS / tmp;
            UNTILGOD = Math.ceil(UNTILGOD);
        }
        else {
            UNTILGOD = "???";
        }
    };

    const _getTotalUsers = () => {
        let totalAdmins = 0;
        let totalUsers = 0;

        if (adminArray.length > 0){
            for (let i = 0; i < adminArray.length; i++){
                totalAdmins++;
            }
        }
        if (userArray.length > 0){
            for (let i = 0; i < userArray.length; i++){
                totalUsers++;
            }
        }

        return [totalAdmins,totalUsers];
    };

    const _updateRounds = () => {
        if (adminArray.length > 0){
            for (let i = 0; i < adminArray.length; i++){
                if (adminArray[i].getActive){
                    adminArray[i].addRound();
                }
            }
        }
        if (userArray.length > 0){
            for (let i = 0; i < userArray.length; i++){
                if (userArray[i].getActive){
                    userArray[i].addRound();
                }
            }
        }
    };

    const newRound = () => {
        _newRound();
    };

    const calcOS = () => {
        _calculateOS();
    }

    return {
        newRound,
        calcOS
    }
})();

// Factory that creates AdminObjects
const AccessObject = (name, notes) => {
    let _activeRounds = 1; // How many sustained rounds has the decker sustained admin?
    let _active = true; // Is the decker currently in host as admin?
    let _access = "user";

    const addRound = () => _activeRounds++;
    const toggleActive = () => _active == true ? _active = false : _active = true;
    const toggleAccess = () => _access === "user" ? _access = "admin" : _access = "user";
    const getRounds = () => _activeRounds;
    const getActive = () => _active;
    const getName = () => name;
    const getNotes = () => notes;
    const getAccess = () => _access;

    return {
        addRound,
        toggleActive,
        toggleAccess,
        getRounds,
        getName,
        getActive,
        getNotes,
        getAccess
    }
};

// Reads input from New Access form and creates new access accordingly
const NewAccess = (() => {
    const _readForm = (type) => {
        let name = document.getElementById("accessName").value;
        let notes = document.getElementById("accessNote").value;
        if (type == "newAdmin"){
            _newAdmin(name,notes);
        }
        else {
            _newUser(name,notes);
        }
    };

    const _newAdmin = (name, notes) => {
        let newAdmin = AccessObject(name, notes);
        newAdmin.toggleAccess()
        adminArray.push(newAdmin);
        NUMADMINS++;
    };

    const _newUser = (name, notes) => {
        let newUser = AccessObject(name, notes);
        userArray.push(newUser);
        NUMUSERS++;
    };

    const add = (type) => {
        _readForm(type);
    };

    return { add }
})();

// Small things that change the OS
const UpdateOS = (() => {
    // OS increases by 1 for each matrix action modified by a hacking program
    // OS increases by 1 per hit on opposing roll
    const _addOS = (type) => {
        if (type === "program"){
            PROGRAMS++;
        }
        else if (type === "hits"){
            HITS++;
        }
        OS++;
    };

    const _decOS = (type) => {
        if (type === "program"){
            PROGRAMS--;
        }
        else if (type === "hits"){
            HITS--;
        }
        OS--;
    };

    const increaseOS = (type) => {
        _addOS(type);
    };

    const decreaseOS = (type) => {
        _decOS(type);
    };

    return { 
        increaseOS,
        decreaseOS,
     }
})();

// Takes input from buttons and acts accordingly
const InputHandler = (() => {
    const _handleCommand = (command) => {
        switch(command){
            case "increasePrograms":
                UpdateOS.increaseOS("program");
                break;
            case "decreasePrograms":
                UpdateOS.decreaseOS("program");
                break;
            case "increaseHits":
                UpdateOS.increaseOS("hits");
                break;
            case "decreaseHits":
                UpdateOS.decreaseOS("hits");
                break;
            case "newRound":
                RoundCalculator.newRound();
                break;
            case "newUser":
                NewAccess.add("newUser");
                RoundCalculator.calcOS();
                break;
            case "newAdmin":
                NewAccess.add("newAdmin");
                RoundCalculator.calcOS();
                break;
        }
        RenderHandler.update();
    };

    const command = (command) => {
        _handleCommand(command);
    };

    return {
        command
    }
})();

// Handles HTML and DOM manipulation
const RenderHandler = (() => {
    const _updateHTML = () => {
        document.getElementById("currentOS").innerHTML = OS;
        if (OS >= 40) {
            document.getElementById("roundsUntilGod").innerHTML = `- R I P -`;
        }
        else if (UNTILGOD == 1){
            document.getElementById("roundsUntilGod").innerHTML = `- GOD IS COMING -`;
        }
        else {
            document.getElementById("roundsUntilGod").innerHTML = `Until GOD: ${UNTILGOD}`;
        }
        document.getElementById("roundsCounter").innerHTML = `Round: ${ROUNDS}`;
        document.getElementById("numPrograms").innerHTML = PROGRAMS;
        document.getElementById("numHits").innerHTML = HITS;
        document.getElementById("activeAdmins").innerHTML = `Active admins: ${NUMADMINS}`;
        document.getElementById("activeUsers").innerHTML =`Active users: ${NUMUSERS}`;
        _clearDOM();
        _loopAccess();
    };

    const _loopAccess = () => {
        for (let i = 0; i < adminArray.length; i++){
           let name = adminArray[i].getName();
           let notes = adminArray[i].getNotes();
           let access = adminArray[i].getAccess();
           let rounds = adminArray[i].getRounds();

           _renderAccess(name,notes,access,rounds, i);
        }
        for (let i = 0; i < userArray.length; i++){
            let name = userArray[i].getName();
            let notes = userArray[i].getNotes();
            let access = userArray[i].getAccess();
            let rounds = userArray[i].getRounds();
 
            _renderAccess(name,notes,access,rounds, i);
        }
    };

    const _renderAccess = (name, notes, access, rounds, index) => {
        let accessDiv = document.createElement("div");
        accessDiv.setAttribute("id", access + index);
        accessDiv.setAttribute("class", "access");

        let accessType = document.createElement("p");
        accessType.innerHTML = access;

        let accessName = document.createElement("p");
        accessName.innerHTML = name;

        let accessRounds = document.createElement("p");
        accessRounds.innerHTML = `Rounds active: ${rounds}`;

        let accessNotes = document.createElement("p");
        accessNotes.innerHTML = notes;

        accessDiv.appendChild(accessType);
        accessDiv.appendChild(accessName);
        accessDiv.appendChild(accessRounds);
        accessDiv.appendChild(accessNotes);

        document.getElementById("accessList").appendChild(accessDiv);
    };

    const _clearDOM = () => {
        let accessDiv = document.getElementsByClassName("access");
        while (accessDiv.length > 0){
            accessDiv[0].parentNode.removeChild(accessDiv[0]);
        }
    };

    const update = () => {
        _updateHTML();
    }

    return {
        update
    }
})();

// Stores data to localstorage
const storeData = (() => {

})();