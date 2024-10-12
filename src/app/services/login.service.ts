import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent} from "@angular/common/http";
import {lastValueFrom, Observable} from "rxjs";
import {createECDH} from "@ravshansbox/browser-crypto";
import {environmentDev} from "../../envirenment/envirement";

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  constructor(private _HttpClient: HttpClient) {
  }

  curve = 'secp256k1';

  publicKey = createECDH(this.curve).generateKeys('base64');

  public getSession(): Observable<any> {
    return this._HttpClient.post(`${environmentDev.APP_API_ROOT}auth/get-session`, {
      curve: this.curve,
      public_key: this.publicKey
    });
  }

  // getToken() takes a sessionId returned from getSession
  public getToken(sessionId: string, code: string): Observable<any> {
    return this._HttpClient.post(`${environmentDev.APP_API_ROOT}auth/get-token`, {
      session_id: sessionId,
      code,
      client_id: environmentDev.SSO_CLIENT_ID
    });
  }

  public setSession(data: { access_token: string, refresh_token: string, user: any }) {
    const {access_token, refresh_token, user} = data
    const {roles_names} = user
    localStorage.setItem('access_token', access_token)
    localStorage.setItem('refresh_token', refresh_token)
    localStorage.setItem('roles_names', roles_names)
  }

  data = {
    "success": true,
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1Zjk3ZGU1NzMyNzU0MzAwMDE1MGVkYzIiLCJpZCI6IjVmOTdkZTU3MzI3NTQzMDAwMTUwZWRjMiIsImRiX2lkIjoiNWY5N2RjNzAzMjc1NDMwMDAxNTBlZGFhIiwicG9zaXRpb25faWQiOiI1ZWUyMjFhMjk5MTEzMDAwMDEyNTYxN2YiLCJ1c2VybmFtZSI6InRlc3Rfb3JnM191c2VyXzEiLCJkZXBhcnRtZW50X2lkIjoiNWY5N2RlNDQzMjc1NDMwMDAxNTBlZGMxIiwiZmlsZV9pZCI6bnVsbCwibWlkZGxlX25hbWUiOiJ0ZXN0X29yZzNfdXNlcl8xIiwibGFzdF9uYW1lIjoidGVzdF9vcmczX3VzZXJfMSIsIm9yZGVyX2J5IjpudWxsLCJpc19kZWxldGVkIjpmYWxzZSwiY3JlYXRlZF9hdCI6IjIwMjAtMTAtMjdUMDg6NDY6MTUuNjU2WiIsImZpcnN0X25hbWUiOiJ0ZXN0X29yZzNfdXNlcl8xIiwidmVyaWZpZWQiOnRydWUsInNlcXVlbmNlX2luZGV4IjpudWxsLCJ2ZXJpZmllZF9waG9uZSI6ZmFsc2UsIm9wZXJhdG9yX251bWJlciI6bnVsbCwicGVyc29uYWxfY29kZSI6IkVCVzk1NzIiLCJhdmF0YXJfaW1hZ2UiOiJ0dCIsImZ1bGxfbmFtZSI6InRlc3Rfb3JnM191c2VyXzEgdGVzdF9vcmczX3VzZXJfMSB0ZXN0X29yZzNfdXNlcl8xIiwidGV4dCI6InRlc3Rfb3JnM191c2VyXzEgdGVzdF9vcmczX3VzZXJfMSB0ZXN0X29yZzNfdXNlcl8xIiwic2hvcnRfdXNlcl9uYW1lIjoidC50LnRlc3Rfb3JnM191c2VyXzEiLCJkZXRhaWxzIjp7Im91dGJveCI6bnVsbCwiY291bnRyeSI6bnVsbCwiYm9zc0FjY2VwdCI6IiIsImlzX2VtYmFzc3kiOmZhbHNlLCJncm91cGVkSXNzdWUiOiIiLCJsaWNlbnNlRmlsdGVyIjoiIiwiZ292ZXJubWVudFR5cGUiOm51bGwsInJlY2lwaWVudHNNb2RlIjpudWxsLCJyZXNvbHV0aW9uVHlwZSI6ImFzc2lzdGFudCIsImlzTWluanVzdENlbnRlciI6ZmFsc2UsIm1pbmp1c3RPcmdUeXBlcyI6bnVsbCwicmVnaXN0ZXJNYW51YWxseSI6IiIsInVzZXJGaWxlc0VuYWJsZWQiOm51bGwsInZpZXdBbGxEb2N1bWVudHMiOiIiLCJtYWluVXNlclNlbGVjdFR5cGUiOm51bGwsIm9yZ2FuaXphdGlvbkNoaWVmSWQiOm51bGwsInNlbWlBdXRvbWF0aWNOdW1iZXIiOm51bGwsImZpc2hrYUxhbmd1YWdlRmlsdGVyIjoiIiwib3V0Z29pbmdGb3JDYW5jZWxhcnkiOiIiLCJvdXRnb2luZ1N1ZmZpeEVuYWJsZWQiOm51bGwsIm91dGdvaW5nU3VmZml4UG9zaXRpb24iOm51bGwsImFkdmFuY2VkUmVqZWN0QW5kQWNjZXB0IjpudWxsLCJyZWd1bGFyVXNlckNhblNlbmRTdWJPcmciOm51bGwsImdlbmVyYWxOdW1iZXJGb3JDYW5jZWxhcnkiOm51bGx9LCJvcmdfbWFpbl9wYXJlbnRfaWQiOiI1OGRiNGZiMDIyZTAwYjBlZjYxZDQ0OWUiLCJvcmdfdGluIjoiODg4Nzc3ODg4IiwiYWRkcmVzcyI6ItCi0JXQodCiINCe0KDQkyAzIiwib3JnX3ZlcmlmaWVkIjpmYWxzZSwicmVnaW9uX2lkIjoiMDBzMGVlZDAwMDByZWdpb24wMDAwMTQiLCJkaXN0cmljdF9pZCI6IjAwczBlZWQwMDAwcmVnaW9uMDAwMDE4IiwiZGJfbmFtZSI6ItCi0LXRgdGCINCe0YDQsyAzLi4iLCJtb2R1bGVzIjpbeyJjb2RlIjoiTEVHQUxfQUNUX01PTklUT1JJTkciLCJlbmFibGVkIjpmYWxzZX0seyJjb2RlIjoiRV9MQVdZRVIiLCJlbmFibGVkIjpmYWxzZX0seyJjb2RlIjoiREVQVVRZX1JFUVVFU1QiLCJlbmFibGVkIjpmYWxzZX0seyJjb2RlIjoiQURNIiwiZW5hYmxlZCI6ZmFsc2V9LHsiY29kZSI6IklKUk9fVklTSVQiLCJlbmFibGVkIjpmYWxzZX0seyJjb2RlIjoiSUpST19HT1ZfVVoiLCJlbmFibGVkIjp0cnVlfSx7ImNvZGUiOiJXT1JLRkxPVyIsImVuYWJsZWQiOnRydWV9LHsiY29kZSI6IkNBQk1JTl9ET0NTIiwiZW5hYmxlZCI6ZmFsc2V9XSwicm9sZXMiOlt7ImlkIjoiNWI5Yjg0Y2JlMGM1NWJiODc3MTU1YTMzIiwibmFtZV9ydSI6ItCa0L7QvdGC0YDQvtC70LvQtdGAINC-0LHRgC4iLCJuYW1lIjoi0JzRg9GA0L7QttCw0LDRgiDQvdCw0LfQvtGA0LDRgtGH0LjRgdC4IiwiY29kZV9uYW1lIjoiQVBQTElDQVRJT05fU1VQRVJWSVNPUiIsInBlcm1pc3Npb25zIjpbIlVTRVJfQVBQRUFMIl19LHsiaWQiOiI1ZmIyOWZjODQ5OTc1ZDAwMDE2ZTkyYzUiLCJuYW1lX3J1Ijoi0K7RgNC40YHRgiDQuNC90YHQv9C10LrRgtC-0YAiLCJuYW1lIjoi0K7RgNC40YHRgiDQuNC90YHQv9C10LrRgtC-0YAiLCJjb2RlX25hbWUiOiJFX0xBV1lFUl9TVVBFUlZJU09SIiwicGVybWlzc2lvbnMiOlsiRV9MQVdZRVJfU1VQRVJWSVNPUiJdfSx7ImlkIjoiNjFhYTM3ZTYxZTU1ODAwMDAxNTc5NDM5IiwibmFtZV9ydSI6ItCQ0YPQtNC40YIiLCJuYW1lIjoi0JDRg9C00LjRgiIsImNvZGVfbmFtZSI6IkFVRElUIiwicGVybWlzc2lvbnMiOlsiQURNSU4iXX0seyJpZCI6IjVmYjMzZmM4NDk5MzVkMDAwMTNlMzNjOSIsIm5hbWVfcnUiOiLQkNGD0LTQuNGCINCQ0LTQvNC40L0iLCJuYW1lIjoi0JDRg9C00LjRgiDQkNC00LzQuNC9IiwiY29kZV9uYW1lIjoiQVVESVRfQURNSU4iLCJwZXJtaXNzaW9ucyI6bnVsbH0seyJpZCI6IjU5MWM2YjZkNWUyOTE4MGNlMDgzZWI2YiIsIm5hbWVfcnUiOiLQmtC-0L3RgtGA0L7Qu9GR0YAiLCJuYW1lIjoi0J3QsNC30L7RgNCw0YLRh9C4IiwiY29kZV9uYW1lIjoiREJfQ09OVFJPTExFUiIsInBlcm1pc3Npb25zIjpbIlZJRVdfUkVQT1JUUyIsIkNSRUFURV9DT05UUk9MX0NBUkQiLCJNQU5BR0VfQ09OVFJPTF9DQVJEIiwiUFVUX09OX0NPTlRST0wiLCJWSUVXX1JFQ0lQSUVOVF9UQVNLUyIsIkFERF9DT05UUk9MX1BMQU4iLCJEQl9DT05UUk9MTEVSIiwiT05MSU5FX01PTklUT1JJTkdfVklFVyJdfSx7ImlkIjoiNTkxYzZiNmQ1ZTI5MTgwY2UwODNlYjZhIiwibmFtZV9ydSI6ItCa0LDQvdGG0LXQu9GP0YDQuNGPIiwibmFtZSI6ItCU0LXQstC-0L3RhdC-0L3QsCIsImNvZGVfbmFtZSI6ImNoYW5jZWxsZXJ5IiwicGVybWlzc2lvbnMiOlsiSU5DT01JTkdfRE9DVU1FTlRfUkVHSVNUUkFUSU9OIiwiQVRUQUNISU5HX0ZJTEVTIiwiRE9DVU1FTlRfUkVHSVNUUkFUSU9OIiwiQVBQTElDQVRJT05fUkVHSVNUUkFUSU9OIiwiR1VJREVTIiwiTUFOQUdJTkdfTk9NRU5DTEFUVVJFIiwiVklFV19SRUNJUElFTlRfVEFTS1MiXX0seyJpZCI6IjU5MWM2YjZkNWUyOTE4MGNlMDgzZWI2YyIsIm5hbWVfcnUiOiLQoNGD0LrQvtCy0L7QtNC40YLQtdC70YwiLCJuYW1lIjoi0KDQsNKz0LHQsNGAIiwiY29kZV9uYW1lIjoiRElSRUNUT1IiLCJwZXJtaXNzaW9ucyI6WyJWSUVXX1JFUE9SVFMiLCJQVVRfT05fQ09OVFJPTCIsIkRPQ1VNRU5UX1JFU09MVVRJT04iLCJSRVNPTFVUSU9OX09VVENPTUlOR19ET0NVTUVOVFMiLCJQQU5FTF9TSVRVQVRJT04iXX0seyJpZCI6IjVjOWNjMjU1ZDQ1MmE4N2JiYWM3NjNjNCIsIm5hbWVfcnUiOiLQodC10LrRgtC-0YAg0YTQuNGI0LXQuiIsIm5hbWUiOiLQo9GB0YLQuNGF0LDRgiIsImNvZGVfbmFtZSI6IkNISVBfU0VDVE9SIiwicGVybWlzc2lvbnMiOlsiVklFV19TRUtUT1JfRklTSEVLIl19LHsiaWQiOiI1YmMxZDBmYWU5ZTFkMjVmZWFhOTBiYjIiLCJuYW1lX3J1Ijoi0KHRg9C_0LXRgCDQutC-0L3RgtGA0L7Qu9GR0YAiLCJuYW1lIjoi0KHRg9C_0LXRgCDQvdCw0LfQvtGA0LDRgtGH0LgiLCJjb2RlX25hbWUiOiJTVVBFUl9DT05UUk9MTEVSIiwicGVybWlzc2lvbnMiOlsiU1VQRVJfQ09OVFJPTCIsIlZJRVdfUkVDSVBJRU5UX1RBU0tTIl19XSwiaXNfMl9zdGVwX2F1dGgiOmZhbHNlLCJyb2xlc19uYW1lcyI6WyJBUFBMSUNBVElPTl9TVVBFUlZJU09SIiwiQVVESVQiLCJBVURJVF9BRE1JTiIsImNoYW5jZWxsZXJ5IiwiQ0hJUF9TRUNUT1IiLCJEQl9DT05UUk9MTEVSIiwiRElSRUNUT1IiLCJFX0xBV1lFUl9TVVBFUlZJU09SIiwiU1VQRVJfQ09OVFJPTExFUiJdLCJkZXBhcnRtZW50X25hbWUiOiJRUVFRIiwicG9zaXRpb25fbmFtZSI6ItCR0L7RiNC70LjSm9C90LjQvdCzINCx0LjRgNC40L3Rh9C4INGe0YDQuNC90LHQvtGB0LDRgNC4IiwicG9zaXRpb25fanNvbiI6eyJydSI6ItCR0L7RiNC70LjSm9C90LjQvdCzINCx0LjRgNC40L3Rh9C4INGe0YDQuNC90LHQvtGB0LDRgNC4IiwidXoiOiLQkdC-0YjQu9C40pvQvdC40L3QsyDQsdC40YDQuNC90YfQuCDRntGA0LjQvdCx0L7RgdCw0YDQuCIsInV6X2xhdG4iOiJCb3NobGlxbmluZyBiaXJpbmNoaSBvyrtyaW5ib3NhcmkifSwicGhvbmUiOm51bGwsInBpbnBwIjoiNTE1MTIwMDcyMDAwMTYiLCJvcmdfY29ubl90eXBlIjozLCJwZXJtaXNzaW9ucyI6WyJDSEFOQ0VMTEVSWSIsIkFTU0lTVEFOVCIsIkFQUEVBTF9DSEFOQ0VMTEVSWSIsIkNBTl9TSUdOIiwiQ0FOX1JFU09MVVRJT04iLCJDQU5fREVDT05UUk9MIiwiU0lNUExFX1VTRVIiLCJDQU5fU0VORF9UQVNLX1RPX0NISUxEIiwiU0lNUExFX1VTRVIiXSwiaGFzX2NvbnRyYWN0Ijp0cnVlLCJjb250cmFjdCI6e30sInZlcnNpb24iOm51bGwsImlhdCI6MTcyODc0MTM3NSwiZXhwIjoxNzI5NDAzNzc1fQ.5mr8vdcf2tbyXvMpR2MU9Cq_ljTQjzonHN2aMxbAQ2s",
    "expires_in": 82784,
    "refresh_token": "zEk75LBilqKr2z4BaiKXRoKNrZ4KE89gJMul2sbuZ378tMI02sE1e8C1rrqHnAJo",
    "user": {
      "_id": "5f97de57327543000150edc2",
      "id": "5f97de57327543000150edc2",
      "db_id": "5f97dc70327543000150edaa",
      "position_id": "5ee221a2991130000125617f",
      "username": "test_org3_user_1",
      "department_id": "5f97de44327543000150edc1",
      "file_id": null,
      "middle_name": "test_org3_user_1",
      "last_name": "test_org3_user_1",
      "order_by": null,
      "is_deleted": false,
      "created_at": "2020-10-27T08:46:15.656Z",
      "first_name": "test_org3_user_1",
      "verified": true,
      "sequence_index": null,
      "verified_phone": false,
      "operator_number": null,
      "personal_code": "EBW9572",
      "avatar_image": "tt",
      "full_name": "test_org3_user_1 test_org3_user_1 test_org3_user_1",
      "text": "test_org3_user_1 test_org3_user_1 test_org3_user_1",
      "short_user_name": "t.t.test_org3_user_1",
      "details": {
        "outbox": null,
        "country": null,
        "bossAccept": "",
        "is_embassy": false,
        "groupedIssue": "",
        "licenseFilter": "",
        "governmentType": null,
        "recipientsMode": null,
        "resolutionType": "assistant",
        "isMinjustCenter": false,
        "minjustOrgTypes": null,
        "registerManually": "",
        "userFilesEnabled": null,
        "viewAllDocuments": "",
        "mainUserSelectType": null,
        "organizationChiefId": null,
        "semiAutomaticNumber": null,
        "fishkaLanguageFilter": "",
        "outgoingForCancelary": "",
        "outgoingSuffixEnabled": null,
        "outgoingSuffixPosition": null,
        "advancedRejectAndAccept": null,
        "regularUserCanSendSubOrg": null,
        "generalNumberForCancelary": null
      },
      "org_main_parent_id": "58db4fb022e00b0ef61d449e",
      "org_tin": "888777888",
      "address": "ТЕСТ ОРГ 3",
      "org_verified": false,
      "region_id": "00s0eed0000region000014",
      "district_id": "00s0eed0000region000018",
      "db_name": "Тест Орг 3..",
      "modules": [
        {
          "code": "LEGAL_ACT_MONITORING",
          "enabled": false
        },
        {
          "code": "E_LAWYER",
          "enabled": false
        },
        {
          "code": "DEPUTY_REQUEST",
          "enabled": false
        },
        {
          "code": "ADM",
          "enabled": false
        },
        {
          "code": "IJRO_VISIT",
          "enabled": false
        },
        {
          "code": "IJRO_GOV_UZ",
          "enabled": true
        },
        {
          "code": "WORKFLOW",
          "enabled": true
        },
        {
          "code": "CABMIN_DOCS",
          "enabled": false
        }
      ],
      "roles": [
        {
          "id": "5b9b84cbe0c55bb877155a33",
          "name_ru": "Контроллер обр.",
          "name": "Мурожаат назоратчиси",
          "code_name": "APPLICATION_SUPERVISOR",
          "permissions": [
            "USER_APPEAL"
          ]
        },
        {
          "id": "5fb29fc849975d00016e92c5",
          "name_ru": "Юрист инспектор",
          "name": "Юрист инспектор",
          "code_name": "E_LAWYER_SUPERVISOR",
          "permissions": [
            "E_LAWYER_SUPERVISOR"
          ]
        },
        {
          "id": "61aa37e61e55800001579439",
          "name_ru": "Аудит",
          "name": "Аудит",
          "code_name": "AUDIT",
          "permissions": [
            "ADMIN"
          ]
        },
        {
          "id": "5fb33fc849935d00013e33c9",
          "name_ru": "Аудит Админ",
          "name": "Аудит Админ",
          "code_name": "AUDIT_ADMIN",
          "permissions": null
        },
        {
          "id": "591c6b6d5e29180ce083eb6b",
          "name_ru": "Контролёр",
          "name": "Назоратчи",
          "code_name": "DB_CONTROLLER",
          "permissions": [
            "VIEW_REPORTS",
            "CREATE_CONTROL_CARD",
            "MANAGE_CONTROL_CARD",
            "PUT_ON_CONTROL",
            "VIEW_RECIPIENT_TASKS",
            "ADD_CONTROL_PLAN",
            "DB_CONTROLLER",
            "ONLINE_MONITORING_VIEW"
          ]
        },
        {
          "id": "591c6b6d5e29180ce083eb6a",
          "name_ru": "Канцелярия",
          "name": "Девонхона",
          "code_name": "chancellery",
          "permissions": [
            "INCOMING_DOCUMENT_REGISTRATION",
            "ATTACHING_FILES",
            "DOCUMENT_REGISTRATION",
            "APPLICATION_REGISTRATION",
            "GUIDES",
            "MANAGING_NOMENCLATURE",
            "VIEW_RECIPIENT_TASKS"
          ]
        },
        {
          "id": "591c6b6d5e29180ce083eb6c",
          "name_ru": "Руководитель",
          "name": "Раҳбар",
          "code_name": "DIRECTOR",
          "permissions": [
            "VIEW_REPORTS",
            "PUT_ON_CONTROL",
            "DOCUMENT_RESOLUTION",
            "RESOLUTION_OUTCOMING_DOCUMENTS",
            "PANEL_SITUATION"
          ]
        },
        {
          "id": "5c9cc255d452a87bbac763c4",
          "name_ru": "Сектор фишек",
          "name": "Устихат",
          "code_name": "CHIP_SECTOR",
          "permissions": [
            "VIEW_SEKTOR_FISHEK"
          ]
        },
        {
          "id": "5bc1d0fae9e1d25feaa90bb2",
          "name_ru": "Супер контролёр",
          "name": "Супер назоратчи",
          "code_name": "SUPER_CONTROLLER",
          "permissions": [
            "SUPER_CONTROL",
            "VIEW_RECIPIENT_TASKS"
          ]
        }
      ],
      "is_2_step_auth": false,
      "roles_names": [
        "APPLICATION_SUPERVISOR",
        "AUDIT",
        "AUDIT_ADMIN",
        "chancellery",
        "CHIP_SECTOR",
        "DB_CONTROLLER",
        "DIRECTOR",
        "E_LAWYER_SUPERVISOR",
        "SUPER_CONTROLLER"
      ],
      "department_name": "QQQQ",
      "position_name": "Бошлиқнинг биринчи ўринбосари",
      "position_json": {
        "ru": "Бошлиқнинг биринчи ўринбосари",
        "uz": "Бошлиқнинг биринчи ўринбосари",
        "uz_latn": "Boshliqning birinchi oʻrinbosari"
      },
      "phone": null,
      "pinpp": "51512007200016",
      "org_conn_type": 3,
      "permissions": [
        "CHANCELLERY",
        "ASSISTANT",
        "APPEAL_CHANCELLERY",
        "CAN_SIGN",
        "CAN_RESOLUTION",
        "CAN_DECONTROL",
        "SIMPLE_USER",
        "CAN_SEND_TASK_TO_CHILD",
        "SIMPLE_USER"
      ],
      "has_contract": true,
      "contract": {},
      "version": null,
      "iat": 1728741375,
      "exp": 1729403775
    }
  }

  public async authenticateAndGetToken(code: string): Promise<void> {
    try {
      // Step 1: Call getSession() with clientId and wait for response
      const sessionResponse = await lastValueFrom(this.getSession());
      // Extract sessionId or any relevant data from the sessionResponse
      const session_id = sessionResponse.id;  // Adjust based on actual response structure

      if (session_id) {
        // Step 2: Call getToken() with sessionId and wait for the token response
        const tokenResponse = await lastValueFrom(this.getToken(session_id, code));
        this.setSession(tokenResponse)
      } else {
        console.error('No sessionId found in session response');
      }
    } catch (error) {
      console.error('Error in authentication flow:', error);
    }
  }


}
