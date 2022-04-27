interface Validateable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;

}

function validate(validatableInput: Validateable) {
    let isValid = true;
    if (validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }
    if (validatableInput.minLength !=null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length > validatableInput.minLength;
    }
    if (validatableInput.maxLength !=null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length < validatableInput.maxLength;
    }
    if (validatableInput.min != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value >validatableInput.min;
    }
    if (validatableInput.max != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value < validatableInput.max;
    }
    return isValid;
}

function autoBind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    };
    return adjDescriptor;
}

class ProjectInput {
    templateEl: HTMLTemplateElement;
    hostEl: HTMLDivElement;
    element: HTMLFormElement;
    titleInputEl: HTMLInputElement;
    descriptionInputEl: HTMLInputElement;
    peopleInputEl: HTMLInputElement;

    constructor() {
        this.templateEl = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostEl = document.getElementById('app')! as HTMLDivElement;

        const importedNode = document.importNode(this.templateEl.content, true);
        this.element = importedNode.firstElementChild as HTMLFormElement;
        this.element.id = 'user-input';

        this.titleInputEl = this.element.querySelector('#title') as HTMLInputElement;
        this.descriptionInputEl = this.element.querySelector('#description') as HTMLInputElement;
        this.peopleInputEl = this.element.querySelector('#people') as HTMLInputElement;

        this.configure();
        this.attach();
    }

    private gatherUserInput(): [string,string,number] | void {
        const enteredTitle = this.titleInputEl.value;
        const enteredDescription = this.descriptionInputEl.value;
        const enteredPeople = this.peopleInputEl.value;

        const titleValidatable: Validateable = {
            value: enteredTitle,
            required: true,
            minLength: 3
        };
        const descriptionValidatable: Validateable = {
            value: enteredTitle,
            required: true,
            minLength: 5
        };
        const peopleValidatable: Validateable = {
            value: enteredTitle,
            required: true,
            min: 0,
            max: 5
        };

        if(
            !validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(peopleValidatable)

        )  {
            alert('Invalid input, please try again!');
            return;
        } else {
            return [enteredTitle, enteredDescription, +enteredPeople]
        }
    }

    private clearInput() {
        this.titleInputEl.value = '';
        this.descriptionInputEl.value = '';
        this.peopleInputEl.value = '';
    }

    @autoBind
    private submitHandler(event: Event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title , desc , people] = userInput;
            console.log(title , desc , people);
            this.clearInput();
        }
    }

    private configure() {
        this.element.addEventListener('submit', this.submitHandler)
    }

    private attach() {
        this.hostEl.insertAdjacentElement('afterbegin', this.element);
    }
}

const prjInput = new ProjectInput();