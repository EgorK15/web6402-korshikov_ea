class ContactQuestion {
    constructor(data) {
        this.name = data.get('name').trim();
        this.email = data.get('email');
        this.question = data.get('question').trim();
        this.applicant = data.has('applicant');
    }

    print() {
        const applicant = this.applicant ? 'да' : 'нет';
        console.log(
            `Вопрос приёмной комиссии\nИмя: ${this.name}\nПочта: ${this.email}\nВопрос: ${this.question}\nАбитуриент: ${applicant}`
        );
    }
}

const form = document.querySelector('.contact-form');
const button = form.querySelector('.contact-form__button');
const statusMessage = form.querySelector('.contact-form__status');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const request = new ContactQuestion(new FormData(form));
    if (!request.name) {
        statusMessage.textContent = 'Введите имя.';
        form.elements.namedItem('name').focus();
        return;
    }

    if (!request.question) {
        statusMessage.textContent = 'Введите вопрос.';
        form.elements.namedItem('question').focus();
        return;
    }

    request.print();
    button.disabled = true;
    statusMessage.textContent = 'Отправка вопроса…';

    try {
        const response = await fetch(form.action, {
            method: form.method,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            statusMessage.textContent = 'Сервер не принял вопрос.';
            return;
        }

        statusMessage.textContent = 'Учебный вопрос принят.';
        form.reset();
    } catch {
        statusMessage.textContent = 'Не удалось отправить вопрос. Запустите локальный сервер и откройте сайт через него.';
    } finally {
        button.disabled = false;
    }
});

button.disabled = false;
statusMessage.textContent = '';
