document.addEventListener('DOMContentLoaded', () => {
    // Проверка поддержки PWA
    if ('serviceWorker' in navigator) {
        console.log('PWA поддерживается');
    }

    // Проверка установки приложения
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('Приложение можно установить');
    });

    // Обработка установки приложения
    window.addEventListener('appinstalled', (evt) => {
        console.log('Приложение установлено');
    });
}); 