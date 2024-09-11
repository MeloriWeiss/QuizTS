import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Auth} from "../services/auth";
import {DefaultResponseType, QuizListType, TestResultType} from "../types/http-response.type";
import {UserInfoType} from "../types/user-info.type";

export class Choice {
    private quizzes: QuizListType[] = [];
    private testResult: TestResultType[] | null = null;
    constructor() {
        this.init().then();
    }

    private async init(): Promise<void> {
        try {
            this.quizzes = await CustomHttp.request(config.host + '/tests');
        } catch (error) {
            console.log(error);
            return;
        }

        const userInfo: UserInfoType | null = Auth.getUserInfo();
        if (userInfo) {
            try {
                const result: TestResultType[] | DefaultResponseType = await CustomHttp.request(config.host + '/tests/results?userId=' + userInfo.userId);
                if (result) {
                    if ((result as DefaultResponseType).error !== undefined) {
                        throw new Error((result as DefaultResponseType).message);
                    }
                    this.testResult = result as TestResultType[];
                }
            } catch (error) {
                console.log(error);
                return;
            }
        }
        this.processQuizzes();
    }
    private processQuizzes(): void {
        const choiceOptionsElement: HTMLElement | null = document.getElementById('choice-options');
        if (this.quizzes && this.quizzes.length > 0 && choiceOptionsElement) {
            this.quizzes.forEach((quiz: QuizListType) => {
                const that: Choice = this;
                const choiceOptionElement: HTMLElement | null = document.createElement('div')
                choiceOptionElement.className = 'choice-option';
                choiceOptionElement.setAttribute('data-id', quiz.id.toString());
                choiceOptionElement.onclick = function () {
                    that.chooseQuiz(<HTMLElement>this);
                }

                const choiceOptionTextElement: HTMLElement | null = document.createElement('div')
                choiceOptionTextElement.className = 'choice-option-text';
                choiceOptionTextElement.innerText = quiz.name;

                const choiceOptionArrowElement: HTMLElement | null = document.createElement('div')
                choiceOptionArrowElement.className = 'choice-option-arrow';

                const choiceOptionImageElement: HTMLElement | null = document.createElement('img')
                choiceOptionImageElement.setAttribute('src', 'images/arrow.svg');
                choiceOptionImageElement.setAttribute('alt', 'Стрелка');

                if (this.testResult) {
                    const result: TestResultType | undefined = this.testResult.find(item => item.testId === quiz.id);
                    if (result) {
                        const choiceOptionResultElement: HTMLElement | null = document.createElement('div')
                        choiceOptionResultElement.className = 'choice-option-result';
                        choiceOptionResultElement.innerHTML =
                            `<div>Результат</div><div>${result.score}/${result.total}</div>`;
                        choiceOptionElement.appendChild(choiceOptionResultElement);
                    }
                }

                choiceOptionArrowElement.appendChild(choiceOptionImageElement);
                choiceOptionElement.appendChild(choiceOptionTextElement);
                choiceOptionElement.appendChild(choiceOptionArrowElement);

                choiceOptionsElement.appendChild(choiceOptionElement);
            });
        }
    }

    private chooseQuiz(element: HTMLElement): void {
        const dataId: string | null = element.getAttribute('data-id');
        if (dataId) {
            location.href = '#/test?id=' + dataId;
        }
    }
}