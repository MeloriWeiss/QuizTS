import {UrlManager} from "../utils/url-manager";
import config from "../../config/config";
import {Auth} from "../services/auth";
import {CustomHttp} from "../services/custom-http";
import {QueryParamsType} from "../types/query-params.type";
import {UserInfoType} from "../types/user-info.type";
import {QuizAnswerType, QuizQuestionType, QuizResultsResponseType, QuizType} from "../types/quiz.type";
import {DefaultResponseType} from "../types/http-response.type";

export class Answers {
    private answers: any = null;
    private test: any = null;
    private userData: any = null;
    private answersElement: any = null;
    private routeParams: QueryParamsType;
    constructor() {
        this.answers = null;
        this.test = null;
        this.userData = null;
        this.answersElement = null;
        this.routeParams = UrlManager.getQueryParams();
        const testId: string = this.routeParams.id;
        this.getQuestions(testId).then();
        this.userData = document.getElementById('completed-by');
        this.userData.innerText = `${Auth.getUserInfo()?.fullName}, ${localStorage.getItem(Auth.emailKey)}`;

        const toResultLinkElement: HTMLElement | null = document.getElementById('to-result');
        if (toResultLinkElement) {
            toResultLinkElement.onclick = function () {
                location.href = `#/result?id=${testId}`;
            }
        }
    }

    private async getQuestions(testId: string): Promise<void> {
        const userInfo: UserInfoType | null = Auth.getUserInfo();
        try {
            if (userInfo) {
                const response: QuizResultsResponseType | DefaultResponseType = await CustomHttp.request(config.host + `/tests/${testId}/result/details?userId=${userInfo.userId}`);
                console.log(response);
                if (response && (response as QuizResultsResponseType).test) {
                    this.test = (response as QuizResultsResponseType).test;
                    this.showTestInfo();
                    this.showQuestions();
                    return;
                } else {
                    throw new Error();
                }
            }
        } catch (error) {
            console.log(error);
        }
        location.href = '#/';
    }

    showTestInfo() {
        if (this.test && this.test.name) {
            const testName: HTMLElement | null = document.getElementById('test-name')
            if (testName) {
                testName.innerText = this.test.name;
            }
        }
    }

    showQuestions() {
        this.answersElement = document.getElementById('answers-content');
        this.test.questions.forEach((question: QuizQuestionType, index: number) => {
            const answer: HTMLElement | null = document.createElement('div');
            answer.className = 'answer';
            const answerQuestion: HTMLElement | null = document.createElement('div');
            answerQuestion.className = 'answer-question common-title';
            answerQuestion.innerHTML = `<span>Вопрос ${index + 1}:</span> ${question.question}`;
            const answerOptions: HTMLElement | null = document.createElement('div');
            answerOptions.className = 'answer-options';
            question.answers.forEach((option: QuizAnswerType) => {
                const answerOption: HTMLElement | null = document.createElement('div');
                if (option.hasOwnProperty('correct')) {
                    if (option.correct === true) {
                        answerOption.className = 'answer-option correct';
                    } else {
                        answerOption.className = 'answer-option wrong';
                    }
                } else {
                    answerOption.className = 'answer-option';
                }
                answerOption.innerText = option.answer;
                answerOptions.appendChild(answerOption);
            });
            answer.appendChild(answerQuestion);
            answer.appendChild(answerOptions);
            this.answersElement.appendChild(answer);
        });
    }
}