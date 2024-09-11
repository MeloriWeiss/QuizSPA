import {UrlManager} from "../utils/url-manager";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http";

export class Answers {
    constructor() {
        this.answers = null;
        this.test = null;
        this.userData = null;
        this.answersElement = null;
        this.routeParams = UrlManager.getQueryParams();
        const testId = this.routeParams.id;
        this.getQuestions(testId);
        this.userData = document.getElementById('completed-by');
        this.userData.innerText = `${Auth.getUserInfo().fullName}, ${localStorage.getItem(Auth.emailKey)}`;

        document.getElementById('to-result').onclick = function () {
            location.href = `#/result?id=${testId}`;
        }
    }

    async getQuestions(testId) {
        const userInfo = Auth.getUserInfo();
        try {
            const response = await CustomHttp.request(config.host + `/tests/${testId}/result/details?userId=${userInfo.userId}`);
            if (response && response.test) {
                this.test = response.test;
                this.showTestInfo();
                this.showQuestions();
                return;
            } else {
                throw new Error();
            }
        } catch (error) {
            console.log(error);
        }
        location.href = '#/';
    }

    showTestInfo() {
        if (this.test && this.test.name) {
            document.getElementById('test-name').innerText = this.test.name;
        }
    }

    showQuestions() {
        this.answersElement = document.getElementById('answers-content');
        this.test.questions.forEach((question, index) => {
            const answer = document.createElement('div');
            answer.className = 'answer';
            const answerQuestion = document.createElement('div');
            answerQuestion.className = 'answer-question common-title';
            answerQuestion.innerHTML = `<span>Вопрос ${index + 1}:</span> ${question.question}`;
            const answerOptions = document.createElement('div');
            answerOptions.className = 'answer-options';
            question.answers.forEach(option => {
                const answerOption = document.createElement('div');
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