let accessArray = [];
let OSMAX = 40; // Max OS score before GOD smites you
let OS = 0; // The decker's OS score
let ROUNDS = 0;
let PROGRAMS = 0; // Number of illegal programs used per actions
let HITS = 0; // Total opposed hits on illegal actions
let UNTILGOD = "???";
let NUMADMINS = 0;
let NUMUSERS = 0;
let CONFIRMONE = false;
let CONFIRMTWO = false;

// Runs each rounds and does necessary calculations
// This should be split up more for organizing
const RoundCalculator = (() => {

    const _newRound = () => {
        _calculateOS();
        _calcRounds();
        _updateRounds();
        ROUNDS++;
    };
    
    const _calculateOS = () => {
        let adminOS = NUMADMINS;
        adminOS = adminOS * 3;
        let userOS = NUMUSERS;
        OS = OS + adminOS + userOS; // Add to OS
    };

    const _calcRounds = () => {
        let adminOS = NUMADMINS;
        adminOS = adminOS * 3;
        let userOS = NUMUSERS;

        let remainingOS = 40 - OS;
        let accessOsPerRound = adminOS + userOS;
        
        if (accessOsPerRound > 0){
            UNTILGOD = remainingOS / accessOsPerRound;
            UNTILGOD = Math.ceil(UNTILGOD);
        }
        else {
            UNTILGOD = "???";
        }

    }

    const _updateRounds = () => {
        if (accessArray.length > 0){
            for (let i = 0; i < accessArray.length; i++){
                if (accessArray[i].getActive()){
                    accessArray[i].addRound();
                }
            }
        }
    };

    const newRound = () => {
        _newRound();
    };

    const calcRounds = () => {
        _calcRounds();
    }

    return {
        newRound,
        calcRounds
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
        accessArray.push(newAdmin);
        NUMADMINS++;
    };

    const _newUser = (name, notes) => {
        let newUser = AccessObject(name, notes);
        accessArray.push(newUser);
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

// Restarts the tracker
const RebootCyberdeck = (() => {
    const _restartTracker = () => {
        accessArray = [];
        OSMAX = 40; // Max OS score before GOD smites you
        OS = 0; // The decker's OS score
        ROUNDS = 0;
        PROGRAMS = 0; // Number of illegal programs used per actions
        HITS = 0; // Total opposed hits on illegal actions
        UNTILGOD = "???";
        NUMADMINS = 0;
        NUMUSERS = 0;
        CONFIRMONE = false;
        CONFIRMTWO = false;
        let tmp = document.getElementById("confirmBtn1");
        tmp.classList.remove("fullyVisible");
        tmp = document.getElementById("confirmBtn2");
        tmp.classList.remove("fullyVisible");
        tmp = document.getElementById("stopBtn");
        tmp.classList.add("halfVisible");
        tmp.classList.add("hoverNo");
        tmp.classList.remove("animateFade");
        tmp.classList.remove("hoverYes");
        document.getElementById("osDiv").classList.remove("glitch");
        document.getElementById("roundsUntilGod").classList.remove("glitch");

    };

    const reboot = () => {
        _restartTracker();
    };

    return { reboot }
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
                RoundCalculator.calcRounds();
                break;
            case "newAdmin":
                NewAccess.add("newAdmin");
                RoundCalculator.calcRounds();
                break;
            case "confirmOne":
                if (CONFIRMONE === false){
                    CONFIRMONE = true;
                    document.getElementById("confirmBtn1").classList.add("fullyVisible");
                }
                else {
                    CONFIRMONE = false;
                    document.getElementById("confirmBtn1").classList.remove("fullyVisible");
                }
                break;
            case "confirmTwo":
                if (CONFIRMTWO === false){
                    CONFIRMTWO = true;
                    document.getElementById("confirmBtn2").classList.add("fullyVisible");
                }
                else {
                    CONFIRMTWO = false;
                    document.getElementById("confirmBtn2").classList.remove("fullyVisible");
                }
                break;
            case "rebootCyberdeck":
                if (CONFIRMONE === true && CONFIRMTWO === true){
                    RebootCyberdeck.reboot();
                    RenderHandler.update();
                }
                break;
        }
        if (CONFIRMONE === true && CONFIRMTWO === true){
            let tmp = document.getElementById("stopBtn");
            tmp.classList.remove("halfVisible");
            tmp.classList.remove("hoverNo");
            tmp.classList.add("animateFade");
            tmp.classList.add("hoverYes");
        }
        else {
            let tmp = document.getElementById("stopBtn");
            tmp.classList.remove("animateFade");
            tmp.classList.remove("hoverYes");
            tmp.classList.add("halfVisible");
            tmp.classList.add("hoverNo");
        }
        if (OS >= 30){
            document.getElementById("osDiv").classList.add("glitch");
            document.getElementById("roundsUntilGod").classList.add("glitch");
        }
        RenderHandler.update();
    };

    const _exitHost = (id) => {
        accessArray[id].toggleActive();
        if (accessArray[id].getAccess() === "admin"){
            NUMADMINS--;
        }
        else {
            NUMUSERS--;
        }
        RoundCalculator.calcRounds();
        RenderHandler.update();
    }

    const exit = (id) => {
        _exitHost(id);
    };

    const command = (command) => {
        _handleCommand(command);
    };

    return {
        command,
        exit
    }
})();

// Handles HTML and DOM manipulation
const RenderHandler = (() => {
    const _updateHTML = () => {
        document.getElementById("osDiv").title = OS;
        document.getElementById("osDiv").innerHTML = OS;
        if (OS >= 40) {
            document.getElementById("roundsUntilGod").innerHTML = `- R I P -`;
            document.getElementById("roundsUntilGod").title = `- R I P -`;
        }
        else if (UNTILGOD == 1){
            document.getElementById("roundsUntilGod").innerHTML = `- GOD IS COMING -`;
            document.getElementById("roundsUntilGod").title = `- GOD IS COMING -`;
        }
        else {
            document.getElementById("roundsUntilGod").innerHTML = `Until GOD: ${UNTILGOD}`;
            document.getElementById("roundsUntilGod").title = `Until GOD: ${UNTILGOD}`;
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
        for (let i = 0; i < accessArray.length; i++){
            if (accessArray[i].getActive() === true){
                let name = accessArray[i].getName();
                let notes = accessArray[i].getNotes();
                let access = accessArray[i].getAccess();
                let rounds = accessArray[i].getRounds();
     
                _renderAccess(name,notes,access,rounds, i);
            }
        }
    };

    const _renderAccess = (name, notes, access, rounds, index) => {
        let accessDiv = document.createElement("div");
        accessDiv.setAttribute("id", access + index);
        accessDiv.setAttribute("class", "access");

        let accessType = document.createElement("p");
        accessType.innerHTML = `Access: ${access}`;

        let accessName = document.createElement("p");
        accessName.innerHTML = `Name: ${name}`;

        let accessRounds = document.createElement("p");
        accessRounds.innerHTML = `Rounds: ${rounds}`;

        let accessNotes = document.createElement("p");
        accessNotes.innerHTML = notes;

        let button = document.createElement("button");
        button.setAttribute("id", index);
        button.setAttribute("class", 'removeAccessButton');
        button.setAttribute('value', index);
        button.textContent = "EXIT HOST";
        button.setAttribute("onclick", "InputHandler.exit(this.id)");

        accessDiv.appendChild(accessName);
        accessDiv.appendChild(accessType);
        accessDiv.appendChild(accessRounds);
        accessDiv.appendChild(accessNotes);
        accessDiv.appendChild(button);

        document.getElementById("accessList").appendChild(accessDiv);
    };

    const _clearDOM = () => {
        let accessDiv = document.getElementsByClassName("access");
        while (accessDiv.length > 0){
            accessDiv[0].parentNode.removeChild(accessDiv[0]);
        }
        let name = document.getElementById("accessName");
        let notes = document.getElementById("accessNote");
        name.value = "";
        notes.value = "";
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