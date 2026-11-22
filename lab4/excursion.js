class ExcursionRequest {
    constructor(data) {
        this.name = data.get('name').trim();
        this.email = data.get('email');
        this.date = data.get('date');
        this.consultation = data.has('consultation');
    }

    print() {
        const consultation = this.consultation ? 'да' : 'нет';
        console.log(
            `Заявка на экскурсию\nИмя: ${this.name}\nПочта: ${this.email}\nДата: ${this.date}\nКонсультация: ${consultation}`
        );
    }
}

const form = document.querySelector('.excursion-form');
const button = form.querySelector('.excursion-form__button');
const statusMessage = form.querySelector('.excursion-form__status');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const request = new ExcursionRequest(new FormData(form));
    if (!request.name) {
        statusMessage.textContent = 'Введите имя.';
        form.elements.namedItem('name').focus();
        return;
    }

    request.print();
    button.disabled = true;
    statusMessage.textContent = 'Отправка заявки…';

    try {
        const response = await fetch(form.action, {
            method: form.method,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            statusMessage.textContent = 'Сервер не принял заявку.';
            return;
        }

        statusMessage.textContent = 'Учебная заявка принята.';
        form.reset();
    } catch {
        statusMessage.textContent = 'Не удалось отправить заявку. Запустите локальный сервер и откройте сайт через него.';
    } finally {
        button.disabled = false;
    }
});
