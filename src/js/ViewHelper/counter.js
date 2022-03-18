export default class Counter {
    #min;

    #max;

    #currentNumber;

    #minusElement;

    #plusElement;

    #numberElement;

    constructor(counterElement, min, max, startingNumber) {
        this.#min = min;
        this.#max = max;
        this.#minusElement = counterElement.querySelector(".minus");
        this.#plusElement = counterElement.querySelector(".plus");
        this.#numberElement = counterElement.querySelector(".number");
        this.#currentNumber = startingNumber;
        this.updateCounter();

        this.#minusElement.addEventListener("click", () => {
            --this.#currentNumber;
            this.updateCounter();
        });
        this.#plusElement.addEventListener("click", () => {
            ++this.#currentNumber;
            this.updateCounter();
        });
    }

    updateIfLimitReached() {
        if (this.#currentNumber === this.#min) {
            this.#minusElement.classList.add("disabled");
        } else {
            this.#minusElement.classList.remove("disabled");
        }

        if (this.#currentNumber === this.#max) {
            this.#plusElement.classList.add("disabled");
        } else {
            this.#plusElement.classList.remove("disabled");
        }
    }

    updateCounter() {
        this.#numberElement.textContent = this.#currentNumber;
        this.updateIfLimitReached();
    }

    get currentNumber() {
        return this.#currentNumber;
    }

    updateMax(value) {
        this.#max = value;
        this.updateIfLimitReached();
    }
}
