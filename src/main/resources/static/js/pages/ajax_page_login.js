let emailLogin, passwordLogin, btnLogin, linkForgotPassword, linkSignUp, emailForgotPassword, btnSubmitForgotPassword,
    nameSignUp, emailSignUp, passwordSignUp, passwordConfirmSignUp, avatarSignUp, btnSubmitSignUp, modalForgotPassword,
    modalSignUp, textPhone, dateBirthday, numberJob, textWorkplace, numberGender, numberStatus, numberRole, homeTown,
    load;
let listRole = [];
let user_now = {};

$(async function () {
    emailLogin = $("#username");
    passwordLogin = $("#password");
    btnLogin = $("#btn-log-in");
    linkForgotPassword = $("#btn-forgot");
    linkSignUp = $("#btn-sign-up");
    emailForgotPassword = $("#email-forgot-password");
    btnSubmitForgotPassword = $("#btn-submit-forgot-password");
    nameSignUp = $("#name-sign-up");
    emailSignUp = $("#email-sign-up");
    passwordSignUp = $("#password-sign-up");
    passwordConfirmSignUp = $("#password-confirm-sign-up");
    avatarSignUp = $("#avatar");
    btnSubmitSignUp = $("#btn-submit-sign-up");
    textPhone = $("#phone");
    textWorkplace = $("#workplace");
    numberGender = $("#gender");
    numberJob = $("#job");
    numberStatus = $("#status");
    dateBirthday = $("#birthday");
    numberRole = $("#role");
    modalForgotPassword = $("#modal-forgot-password");
    modalSignUp = $("#modal-sign-up");
    homeTown = $("#home-town");
    load = $("#load");

    await loadRole();
    login();
    signUp();
    submitSignUp();
    forgotPassword();
    submitForgotPassword();
    showSelectCustom(numberGender, listGender, "<>");
    showSelectCustom(numberJob, listJob, "<>");
    showSelectCustom(numberStatus, listStatus, "<>");
    showRoleList(numberRole, listRole, "<>");

    let url = new URL(window.location.href);
    var userSignUp = url.searchParams.get("dang-ky");
    if (userSignUp)
        linkSignUp.click();
})

async function loadRole() {
    await allRole()
        .then(rs => {
            if (rs.status === 200) {
                listRole = rs.data;
            }
        })
        .catch(e => {
            console.log("error load role")
        })
}

function forgotPassword() {
    linkForgotPassword.click(function () {
        modalForgotPassword.modal("show");
    })
}

function submitForgotPassword() {
    btnSubmitForgotPassword.click(async function () {
        let {val: valueEmailForgotPassword, check: checkEmailForgotPassword}
            = checkEmail(emailForgotPassword, "Email kh??ng h???p l???.");
        if (checkEmailForgotPassword) {
            load.removeClass("d-none");
            await userForgotPassword(valueEmailForgotPassword)
                .then(rs => {
                    if (rs.status === 200) {
                        alertReport(true,
                            "M???t kh???u c???a b???n ???? ???????c thay ?????i. H??y v??o email ????? bi???t m???t kh???u m???i!!!");
                    } else {
                        alertReport(false, "C?? l???i x???y ra. M???i ki???m tra l???i email v?? g???i l???i y??u c???u!!!");
                    }
                })
                .catch(e => {
                    alertReport(false, "C?? l???i x???y ra. M???i ki???m tra l???i email v?? g???i l???i y??u c???u!!!");
                    console.log(e);
                });
            modalForgotPassword.modal("hide");
            load.addClass("d-none");
        }
    })
}

function signUp() {
    linkSignUp.click(function () {
        modalSignUp.modal("show");
    })
}

function submitSignUp() {
    btnSubmitSignUp.click(async function () {
        let {
            val: valueName,
            check: checkName
        } = checkData(nameSignUp, /./, "B???n ch??a nh???p t??n.");
        let {
            val: valueEmailSignUp,
            check: checkEmailSignUp
        } = checkEmail(emailSignUp, "Email kh??ng h???p l???.");
        let {
            val: valuePasswordSignUp,
            check: checkPasswordSignUp
        } = checkPassword(passwordSignUp,
            "B???n nh???p m???t kh???u ch??a ????ng ?????nh d???ng (t???i thi???u 8 k?? t??? g???m c??? s??? v?? ch???).");
        let {
            val: valuePasswordConfirmSignUp,
            check: checkPasswordConfirmSignUp
        } = checkPasswordConfirm(passwordConfirmSignUp, valuePasswordSignUp, "M???t kh???u kh??ng kh???p.");
        let {
            val: valTextPhone,
            check: checkTextPhone
        } = checkPhone(textPhone, "S??T kh??ng h???p l???.");
        let {
            val: valBirthday,
            check: checkDateBirthday
        } = checkBirthday(dateBirthday, "Ng??y sinh kh??ng h???p l???(<18).");
        let {
            val: valJob,
            check: checkJob
        } = checkData(numberJob, /^\d+$/, "B???n ch??a ch???n ngh??? nghi???p.");
        let {
            val: valWorkplace,
            check: checkWorkplace
        } = checkData(textWorkplace, /./, "B???n ch??a nh???p n??i l??m vi???c.");
        let {
            val: valGender,
            check: checkGender
        } = checkData(numberGender, /^\d+$/, "B???n ch??a ch???n gi???i t??nh.");
        let {
            val: valStatus,
            check: checkStatus
        } = checkData(numberStatus, /^\d+$/, "B???n ch??a ch???n t??nh tr???ng h??n nh??n.");
        let {
            val: valRole,
            check: checkRole
        } = checkData(numberRole, /^\d+$/, "B???n ch??a ch???n t?? c??ch ????ng k??.");
        let {
            val: valueAvatar,
            check: checkAvatar
        } = checkFile(avatarSignUp, "File ???nh ph???i nh??? h??n 10MB.");
        let {
            val: valueHomeTown,
            check: checkHomeTown
        } = checkData(homeTown, /./, "B???n ch??a nh???p qu?? qu??n.");

        if (checkName && checkEmailSignUp && checkPasswordSignUp && checkPasswordConfirmSignUp && checkTextPhone
            && checkDateBirthday && checkStatus && checkStatus && checkWorkplace && checkGender && checkRole
            && checkJob && checkHomeTown) {
            valueAvatar = DEFAULT_AVATAR;
            if (checkAvatar) {
                await uploadFile(Array.from(avatarSignUp.prop('files')))
                    .then(rs => {
                        if (rs.status === 200) {
                            valueAvatar = rs.data[0];
                        } else {
                            valueAvatar = DEFAULT_AVATAR;
                        }
                    })
                    .catch(e => {
                        valueAvatar = DEFAULT_AVATAR;
                        console.log(e)
                    })
            }
            let user = {
                name: valueName,
                email: valueEmailSignUp,
                password: valuePasswordSignUp,
                avatar: valueAvatar,
                phone: valTextPhone,
                job: valJob,
                gender: valGender,
                status: valStatus,
                workplace: valWorkplace,
                birthday: valBirthday,
                role: listRole.find(r => r.id === (valRole - 0)),
                homeTown: valueHomeTown
            }

            let check = false;
            await userInsert(user)
                .then(rs => {
                    if (rs.status === 200) {
                        check = true;
                        user_now = rs.data;
                    }
                })
                .catch(e => {
                    console.log(e);
                })

            modalSignUp.modal("hide");
            if (check) {
                alertReport(check, "????ng k?? th??nh c??ng. Vui l??ng ?????i gi??y l??t...");
                check = false;
                let formData = new FormData();
                formData.append("username", valueEmailSignUp);
                formData.append("password", valuePasswordSignUp);

                await ajaxUploadFormData("/security-login", formData)
                    .then((rs) => {
                        if (rs.status === 200) {
                            check = true;
                            window.location.href = listHome.find(h => h.val === user_now.role.name).url;
                        }
                    }).catch(e => {
                        console.log(e);
                    });
                if (check) {
                    alertReport(true, "????ng nh???p th??nh c??ng!!!");
                    await notify_impl(valueEmailSignUp, "????ng k?? th??nh c??ng",
                        `Ch??o m???ng b???n ?????n v???i h??? th???ng c???a ch??ng th??i.<br>
                         Click v??o ????y ????? v??o <a href="http://localhost:8080/"><b>Trang ch???</b></a><br>
                         Ch??c b???n t??m ???????c ph??ng m?? m??nh mong mu???n!!!`);

                    window.location.href = listHome.find(h => h.val === user_now.role.name).url;
                } else
                    alertReport(false, "C?? l???i x???y ra. Vui l??ng ????ng nh???p l???i!!!");
            } else
                alertReport(check, "????ng k?? kh??ng th??nh c??ng!!!");
        }
    })
}


function login() {
    btnLogin.click(async function () {
        let {
            val: valueEmailLogin,
            check: checkEmailLogin
        } = checkEmail(emailLogin, "Email kh??ng h???p l???.");
        let {
            val: valuePasswordLogin,
            check: checkPasswordLogin
        } = checkPassword(passwordLogin,
            "B???n nh???p m???t kh???u ch??a ????ng ?????nh d???ng (t???i thi???u 8 k?? t??? g???m c??? s??? v?? ch???)");

        if (checkEmailLogin && checkPasswordLogin) {
            let formData = new FormData();
            formData.append("username", valueEmailLogin);
            formData.append("password", valuePasswordLogin);

            let check = false;
            await ajaxUploadFormData("/security-login", formData)
                .then((rs) => {
                    if (rs.status === 200) {
                        check = true;
                        user_now = rs.data;
                        window.location.href = listHome.find(h => h.val === user_now.role.name).url;
                    }
                }).catch(e => {
                    console.log(e);
                });

            alertReport(check,
                check ? "????ng nh???p th??nh c??ng" : "Th??ng tin ????ng nh???p kh??ng ch??nh x??c. M???i ki???m tra l???i!!!");
        }
    })
}