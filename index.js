function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

// DESCRIPTION of GameMachine methods

// getTotalAmountOfMoney - getting amount cash in game machine.
// withdrawalMoney - withdrawal money from game machine.
// addMoneyToGameMachine - adding money to game machine.
// playThisGameMachine - game in which user play.

class GameMachine {
    constructor(machineMoney) {
        this.machineMoney = machineMoney;
    }

    get getTotalMoney() {

        return this.machineMoney;
    }

    withdrawalMoney(money) {
        if (this.machineMoney >= money) {
            this.machineMoney -= money;

        } else if (this.machineMoney < money) {
            if (confirm(`game machine don't have enough money for you withdrawal. It has only${this.machineMoney}$. Do you want to withdrawal all money?`)) {
                this.machineMoney -= this.machineMoney;
            } else {
                console.log(`withdrawal declined.`);
            }
        }
        return console.log(`Game machine balance: ${this.machineMoney}$`);
    }

    addMoneyToGameMachine(money) {
        this.machineMoney += money;
        return console.log(`Game machine balance: ${this.machineMoney}$`);
    }

    playThisGameMachine(playersMoney) {
        // this.machineMoney += playersMoney
        let firstNumber = getRandomInt(4);
        let secondNumber = getRandomInt(4);
        let thirdNumber = getRandomInt(4);
        let maxLot = this.machineMoney / 3;

        if (playersMoney >= maxLot) {
            return console.log(`You lot is so big. Max lot is ${maxLot.toFixed(0) - 1}$.Please decrease your lot`);

        } else if (playersMoney < maxLot) {
            if (firstNumber === secondNumber && secondNumber === thirdNumber) {
                console.log(firstNumber, secondNumber, thirdNumber)
                this.machineMoney -= (playersMoney * 3);

                console.log(`Jackpot! player win: ${playersMoney * 3}$`)
                console.log(`Game machine balance ${this.machineMoney}$`)
                return playersMoney * 3;

            } else if (firstNumber === secondNumber || secondNumber === thirdNumber || firstNumber === thirdNumber) {
                console.log(firstNumber, secondNumber, thirdNumber)
                console.log(`player win: ${playersMoney * 2}$`)
                this.machineMoney -= (playersMoney * 2)
                console.log(`Game machine balance ${this.machineMoney}$`)

                return playersMoney * 2;

            } else {
                this.machineMoney += playersMoney

                console.log(`Player lose ${playersMoney}$`)
                console.log(`Game machine balance ${this.machineMoney}$`)
                return -playersMoney;
            }

        }

    }
}

// DESCRIPTION of Casino methods

// getMachineCount - allows to get game machines amount.
// getMoney - allows to get sum of all game machines in casino.

class Casino {
    constructor(name) {
        this.name = name;
        this.casinoMachines = [];

    }

    get getMachineCount() {

        return console.log(`Casino has ${this.casinoMachines.length} game machine`);

    }

    get getMoney() {
        let total = 0;
        this.casinoMachines.forEach((casinoMachine) => {
            total += casinoMachine.getTotalMoney;
        })
        console.log(`Total amount of money in casino is ${total}$`);
        return total;

    }
}

// DESCRIPTION of User methods

// selectGameMachine - select game machine for playing.
// play - user play on game machine.

class User {
    constructor(name, money) {
        this.name = name;
        this.money = money;
        this.selectedGameMachine = null;
    }

    selectGameMachine(gameMachine) {
        return this.selectedGameMachine = gameMachine;

    }

    play(money) {
        if (this.money >= money) {
            if (this.selectedGameMachine === null) {
                return console.log(`Before play, choose game machine ,please`);
            }
            let resultOfTheGame = this.selectedGameMachine.playThisGameMachine(money);
            this.money += (resultOfTheGame);
            if (this.money < 0) {
                this.money = 0;
            }
            return this.money;
        } else if (this.money < money) {
            return console.log('You do not have enough money');
        }


    }

}

const user1 = new User("Igor", 2000);


// DESCRIPTION of SuperAdmin methods

// createNewCasino - creat new casino.
// createNewGameMachine - creat new game machine, superAdmin pay for this gameMachine.
// takeMoneyFromCasino - withdrawal money from casino and add it to superAdmin balance.
// addMoneyToCasino - using superAdmin's money and divide them equally between all casino's game machines .
// addMoneyToChosenGameMachine - using superAdmin's money and add them to chosen game machine balance.
// removeGameMachine - remove the chosen game machine, money of this game machine divide equally between rest of machines in this casino.

class SuperAdmin extends User {
    constructor(name, money) {
        super(name, money);
        this.casinos = [];
    }

    createNewCasino(casinoName) {

        let casino = new Casino(casinoName)
        this.casinos.push(casino);
        console.log(`${casinoName} created`);
        return casino;

    }

    createNewGameMachine(moneyForGameMachine, casinoId) {
        if (moneyForGameMachine > this.money) {
            console.error('You do not have enough money for creating new game machine')
            return;
        }
        let gameMachine = new GameMachine(moneyForGameMachine);

        this.money -= moneyForGameMachine;
        this.casinos[casinoId].casinoMachines.push(gameMachine);
        console.log(`After creating new gameMachine ${this.name}'s balance is ${this.money}$ `);
        return gameMachine;

    }

    takeMoneyFromCasino(number, casinoId) {

        let casinosGameMachine = this.casinos[casinoId].casinoMachines;
        let casinoMachinesMoney = [];

        casinosGameMachine.map((el) => casinoMachinesMoney.push(el.machineMoney))
        let sortedCasinoMachine = casinoMachinesMoney.sort((a, b) => b - a);
        let casinoBank = this.casinos[casinoId].getMoney;


        if (number > casinoBank) {
            console.error(`Sorry, but Casino do not have enough money for you withdrawal. Casino bank is only ${casinoBank}$`)
            return;
        }
        this.money += number;
        console.log(`${this.name} take ${number}$ from casino. ${this.name}'s balance: ${this.money}$ `);

        let casinoGiveMoney = sortedCasinoMachine.map((gameMachineMoney) => {
            if (number >= gameMachineMoney) {
                number = number - gameMachineMoney
                gameMachineMoney -= number
                gameMachineMoney = 0;

            } else if (gameMachineMoney > number) {
                gameMachineMoney -= number
                number = 0;
            }

            return gameMachineMoney;
        })
        for (let i = 0; i < casinoGiveMoney.length; i++) {
            this.casinos[casinoId].casinoMachines[i].machineMoney = casinoGiveMoney[i];

        }

        console.log(this.casinos);
        return this.casinos;

    }

    addMoneyToCasino(casinoId, addMoney) {

        if (addMoney > this.money) {
            console.log('You do not have enough money')
            return;
        }
        this.money -= addMoney;
        console.log(`${this.name} pay ${addMoney}$. ${this.name} balance ${this.money}$`);
        let moneyForEachMachine = addMoney / this.casinos[casinoId].casinoMachines.length;

        this.casinos[casinoId].casinoMachines.forEach((machine) => {
            machine.machineMoney += Math.floor(moneyForEachMachine);
        })
        console.log(this.casinos);
        return this.casinos;

    }

    addMoneyToChosenGameMachine(casinoId, gameMachineId, addMoney) {

        if (addMoney > this.money) {
            console.log('You do not have enough money')
            return;
        }
        this.casinos[casinoId].casinoMachines[gameMachineId].addMoneyToGameMachine(addMoney);
        this.money -= addMoney;
        console.log(`${this.name} pay ${addMoney}$. ${this.name} balance ${this.money}$`);
        console.log(this.casinos);
        return this.casinos;

    }

    removeGameMachine(casinoId, gameMachineId) {
        let deletedMachineMoney = this.casinos[casinoId].casinoMachines[gameMachineId].machineMoney;
        let result = deletedMachineMoney / (this.casinos[casinoId].casinoMachines.length - 1);
        this.casinos[casinoId].casinoMachines.splice(gameMachineId, 1);
        this.casinos[casinoId].casinoMachines.forEach((el) => {
            el.machineMoney += Math.floor(result);
        })
        console.log(this.casinos);
        return this.casinos;
    }

}

const superAdmin1 = new SuperAdmin('Pavel', 100000)
// let myCasino = superAdmin1.createNewCasino('CasinoLotto')
// let gameMachine0 = superAdmin1.createNewGameMachine(1000, 0)




