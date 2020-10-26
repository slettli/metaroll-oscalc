let adminArray = [];
let userArray = [];
let OSMAX = 40; // Max OS score before GOD smites you
let OS = 0; // The decker's OS score

// Runs each rounds and does necessary calculations
// This should be split up more for organizing
const RoundCalculator = (() => {

    const _newRound = () => {
        _calculateOS();
        _updateRounds();
    };
    
    const _calculateOS = () => {
        let adminOS = _getTotalUsers([0]);
        adminOS = adminOS * 3;
        let userOS = _getTotalUsers([1]);
        OS += adminOS + userOS;
    };

    const _getTotalUsers = () => {
        let totalAdmins = 0;
        let totalUsers = 0;

        if (adminArray.length > 0){
            for (let i = 0; i < adminArray.length; i++){
                totalAdmins += i.getRounds;
            }
        }
        if (userArray.length > 0){
            for (let i = 0; i < userArray.length; i++){
                totalUsers += i.getRounds;
            }
        }

        return (totalAdmins,totalUsers);
    };

    const _updateRounds = () => {
        if (adminArray.length > 0){
            for (let i = 0; i < adminArray.length; i++){
                if (i.getActive){
                    i.addRound();
                }
            }
        }
        if (userArray.length > 0){
            for (let i = 0; i < userArray.length; i++){
                if (i.getActive){
                    i.addRound();
                }
            }
        }
    };

    const newRound = () => {
        _newRound();
    };

    return {
        newRound,

    }
})();

// Factory that creates AdminObjects
const AdminObject = (name) => {
    let _activeRounds = 0; // How many sustained rounds has the decker sustained admin?
    let _active = true; // Is the decker currently in host as admin?

    const addRound = () => _activeRounds++;
    const toggleActive = () => _active == true ? _active = false : _active = true;
    const getRounds = () => _activeRounds;
    const getName = () => name;
    const getActive = () => _active;

    return {
        addRound,
        toggleActive,
        getRounds,
        getName,
        getActive,
    }
};

const NewAdmin = (() => {
    const createAdmin = (name) => {
        let newAdmin = AdminObject(name);
        adminArray.push(newAdmin);
    };
    return { createAdmin }
})();

// Factory that creates UserObjects
const UserObject = (name) => {
    let _activeRounds = 0; // How many sustained rounds has the decker sustained admin?
    let _active = true; // Is the decker currently in host as admin?

    const addRound = () => _activeRounds++;
    const toggleActive = () => _active == true ? _active = false : _active = true;
    const getRounds = () => _activeRounds;
    const getName = () => name;
    const getActive = () => _active;

    return {
        addRound,
        toggleActive,
        getRounds,
        getName,
        getActive,
    }
};

const NewUser = (() => {
    const createUser = (name) => {
        let newUser = UserObject(name);
        userArray.push(newUser);
    };
    return { createUser }
})();

// Small things that change the OS
const UpdateOS = (() => {
    // OS increases by 1 for each matrix action modified by a hacking program
    // OS increases by 1 per hit on opposing roll
    const _addOS = (num) => {
        OS += num;
    };

    const illegalOrProgram = (numActions) => {
        _addOS(numActions);
    };

    return { illegalOrProgram }
})();

// Stores data to localstorage
const storeData = (() => {

})();