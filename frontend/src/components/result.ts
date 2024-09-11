import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";
import {Auth} from "../services/auth";
import {UrlManager} from "../utils/url-manager";
import {QueryParamsType} from "../types/query-params.type";
import {UserInfoType} from "../types/user-info.type";
import {DefaultResponseType, PassTestResponseType} from "../types/http-response.type";

export class Result {
    private routeParams: QueryParamsType;
    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        const testId = this.routeParams.id;
        const toAnswersLinkElement = document.getElementById('to-answers');
        if (toAnswersLinkElement) {
            toAnswersLinkElement.onclick = function () {
                location.href = '#/answers?id=' + testId;
            }
        }

        this.init().then();
    }

    private async init(): Promise<void> {
        const userInfo: UserInfoType | null = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/';
            return;
        }
        if (this.routeParams.id) {
            try {
                const result: PassTestResponseType | DefaultResponseType = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id +
                    '/result?userId=' + userInfo.userId);
                if (result) {
                    if ((result as DefaultResponseType).error !== undefined) {
                        throw new Error((result as DefaultResponseType).message);
                    }
                    const resultScoreElement: HTMLElement | null = document.getElementById('result-score');
                    if (resultScoreElement) {
                        resultScoreElement.innerText =
                            `${(result as PassTestResponseType).score}/${(result as PassTestResponseType).total}`;
                    }
                    return;
                }
            } catch (error) {
                console.log(error);
            }
        }

        location.href = '#/';
    }
}