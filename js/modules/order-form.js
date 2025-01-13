export function initOrderForm() {
	const form = document.querySelector('.feedback-form');
	const textarea = form.querySelector('.feedback-form__textarea');
	const contactInput = form.querySelector('.feedback-form__inputs-text');
	const submitButton = form.querySelector('.feedback-form__inputs-button');

	submitButton.addEventListener('click', async event => {
		event.preventDefault();

		const projectDescription = textarea.value.trim();
		const contactInfo = contactInput.value.trim();

		if (!projectDescription || !contactInfo) {
			alert('Пожалуйста, заполните все поля');
			return;
		}

		const formData = {
			projectDescription,
			contactInfo,
			submissionTime: new Date().toISOString(),
		};

		try {
			const response = await fetch(
				'https://hook.eu2.make.com/mjab95ygp4snnrhm17wx1thexcjfcunm',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(formData),
				}
			);

			if (response.ok) {
				alert(
					'Спасибо! Мы приняли ваше сообщение. Постараемся связаться с вами по указанному контакту.'
				);
				textarea.value = '';
				contactInput.value = '';
			} else {
				throw new Error('Не удалось отправить заявку');
			}
		} catch (error) {
			console.error('Ошибка:', error);
			alert('Произошла ошибка при отправке заявки. Попробуйте позже.');
		}
	});
}

// Initialize the form when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initOrderForm);
