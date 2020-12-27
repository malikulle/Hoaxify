import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { register } from "timeago.js";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translations: {
        "userSignup.signUp": "Sign Up",
        "userSignup.username": "Username",
        "userSignup.displayName": "DisplayName",
        "userSignup.password": "Password",
        "userSignup.rePassword": "Password Repeat",
        "userSignup.passwordNotMatch": "Password doesnt match",
        "userLoginPage.Login": "Login",
        logout: "Logout",
        users: "Users",
        next: "Next",
        previous: "Previous",
        LoadFailure: "Load Failure",
        userNotFound: "User Not Found",
        edit: "Edit",
        save: "Save",
        cancel: "Cancel",
        "success.update": "Updated Successfully",
        myProfile: "Profile",
        noHoax: "There are no hoaxes",
        loadOldHoax: "Load Old Hoaxes",
        loadNewHoaxes: "Load New Hoaxes",
        "Delete Hoax": "Delete Hoax",
        "Are you sure to delete hoax?": "Are you sure to delete hoax?",
        "Delete My Account" : "Delete My Account",
        "Are you sure to delete your account?" :"Are you sure to delete your account?"
      },
    },
    tr: {
      translations: {
        "userSignup.signUp": "Kayıt Ol",
        "userSignup.username": "Kullanici Adi",
        "userSignup.displayName": "Görünür İsim",
        "userSignup.password": "Parola",
        "userSignup.rePassword": "Parola Tekrar",
        "userSignup.passwordNotMatch": "Parolalar uyuşmuyor",
        "userLoginPage.Login": "Giriş Yap",
        logout: "Çıkış Yap",
        users: "Kullanıcılar",
        next: "İleri",
        previous: "Önceki",
        LoadFailure: "Bir hata olustu.",
        userNotFound: "Kullanıcı Bulunamadı",
        edit: "Güncelle",
        save: "Kaydet",
        cancel: "Kapat",
        "success.update": "Basarili Bir Sekilde Güncellendi",
        myProfile: "Profil",
        noHoax: "Hiç bir Hoax Bulunamadı.",
        loadOldHoax: "Geçmiş Hoaxları Getir",
        loadNewHoaxes: "Yeni Hoaxlar Var",
        "Delete Hoax": "Hoaxu Sil",
        "Are you sure to delete hoax?": "Silmek İstediğinize Emin Misiniz ?",
        "Delete My Account" : "Hesabımu Sil",
        "Are you sure to delete your account?" :"Hesabınızı Silmek İstediğinizden Emin misiniz ?"
      },
    },
  },
  fallbackLng: "tr",
  ns: ["translations"],
  defaultNS: "translations",
  keySeparator: false,
  interpolation: {
    escapeValue: false,
    formatSeparator: ",",
  },
  react: {
    wait: true,
  },
});

const timeagoTR = (number, index) => {
  return [
    ["az önce", "şimdi"],
    ["%s saniye önce", "%s saniye içinde"],
    ["1 dakika önce", "1 dakika içinde"],
    ["%s dakika önce", "%s dakika içinde"],
    ["1 saat önce", "1 saat içinde"],
    ["%s saat önce", "%s saat içinde"],
    ["1 gün önce", "1 gün içinde"],
    ["%s gün önce", "%s gün içinde"],
    ["1 hafta önce", "1 hafta içinde"],
    ["%s hafta önce", "%s hafta içinde"],
    ["1 ay önce", "1 ay içinde"],
    ["%s ay önce", "%s ay içinde"],
    ["1 yıl önce", "1 yıl içinde"],
    ["%s yıl önce", "%s yıl içinde"],
  ][index];
};
register("tr", timeagoTR);

export default i18n;
