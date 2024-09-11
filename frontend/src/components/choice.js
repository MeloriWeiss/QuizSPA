import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config";
import {Auth} from "../services/auth.js";

export class Choice {
    constructor() {
        this.quizzes = [];
        this.testResult = null;
        //this.routeParams = UrlManager.getQueryParams();
        // UrlManager.checkUserData(this.routeParams);

        // UrlManager.checkUserData();
        this.init();
    }

    async init() {
        try {
            const result = await CustomHttp.request(config.host + '/tests');
            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }
                this.quizzes = result;
            }
        } catch (error) {
            return console.log(error);
        }

        const userInfo = Auth.getUserInfo();
        if (userInfo) {
            try {
                const result = await CustomHttp.request(config.host + '/tests/results?userId=' + userInfo.userId);
                if (result) {
                    if (result.error) {
                        throw new Error(result.message);
                    }
                    this.testResult = result;
                }
            } catch (error) {
                return console.log(error);
            }
        }
        this.processQuizzes();
    }
    processQuizzes() {
        const choiceOptionsElement = document.getElementById('choice-options');
        if (this.quizzes && this.quizzes.length > 0) {
            this.quizzes.forEach(quiz => {
                const that = this;
                const choiceOptionElement = document.createElement('div')
                choiceOptionElement.className = 'choice-option';
                choiceOptionElement.setAttribute('data-id', quiz.id);
                choiceOptionElement.onclick = function () {
                    that.chooseQuiz(this);
                }

                const choiceOptionTextElement = document.createElement('div')
                choiceOptionTextElement.className = 'choice-option-text';
                choiceOptionTextElement.innerText = quiz.name;

                const choiceOptionArrowElement = document.createElement('div')
                choiceOptionArrowElement.className = 'choice-option-arrow';

                const choiceOptionImageElement = document.createElement('img')
                choiceOptionImageElement.setAttribute('src', 'images/arrow.svg');
                choiceOptionImageElement.setAttribute('alt', 'Стрелка');

                const result = this.testResult.find(item => item.testId === quiz.id);
                if (result) {
                    const choiceOptionResultElement = document.createElement('div')
                    choiceOptionResultElement.className = 'choice-option-result';
                    choiceOptionResultElement.innerHTML =
                    `<div>Результат</div><div>${result.score}/${result.total}</div>`;
                    choiceOptionElement.appendChild(choiceOptionResultElement);
                }

                choiceOptionArrowElement.appendChild(choiceOptionImageElement);
                choiceOptionElement.appendChild(choiceOptionTextElement);
                choiceOptionElement.appendChild(choiceOptionArrowElement);

                choiceOptionsElement.appendChild(choiceOptionElement);
            });
        }
    }

    chooseQuiz(element) {
        const dataId = element.getAttribute('data-id');
        if (dataId) {
            location.href = '#/test?id=' + dataId;
            // sessionStorage.setItem('testId', dataId);
            // location.href = '#/test';
        }
    }
}