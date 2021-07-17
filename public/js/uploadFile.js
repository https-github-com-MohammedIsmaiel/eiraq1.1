/** @format */
const inputchat = document.getElementsByClassName('room-chat')[0];
$('#files').change(function () {
	filename = this.files[0].name;
	inputchat.value = filename;
});

$('#form').on('submit', handleFormSubmit);
// let typingTimeout = null;
// let isStartTypeSent = false;
// let typingUsers = new Set();

function handleFormSubmit(e) {
	inputchat.value = ' ';
	e.preventDefault();
	const form = $(this);
	const formData = new FormData(form[0]);
	for (const p of formData) {
		if (p[1].size <= 0) {
			return;
		}
	}
	$.ajax({
		method: 'POST',
		data: formData,
		cache: false,
		contentType: false,
		processData: false,
		url: '/upload',
		success: handleUploadSuccess,
		xhr: handleUploadProgress,
	});
}

function handleUploadSuccess(resp) {
	socket.emit('file', {
		name,
		file: {
			url: `${resp.newFilename}`,
			filename: resp.originalFilename,
			messagewriter: logedInUser.innerText,
		},
	});
	$('#form')[0].reset();
	setTimeout(() => {
		$('#upload-progress').text('');
	}, 2000);
}

function handleUploadProgress() {
	const xhr = new window.XMLHttpRequest();
	xhr.upload.addEventListener(
		'progress',
		(e) => {
			const percent = (event.loaded / event.total) * 100;
			const progress = Math.round(percent);
			$('#upload-progress').text(`${progress}% uploaded`);
		},
		false,
	);
	xhr.addEventListener(
		'error',
		(e) => {
			$('#upload-progress').text('Upload errored!');
			console.error(e);
		},
		false,
	);
	xhr.addEventListener(
		'abort',
		(e) => {
			$('#upload-progress').text('Upload aborted');
			console.error(e);
		},
		false,
	);

	return xhr;
}

function handleFile(f) {
	$('#chat').append(`
            <li><b>${f.file.messagewriter} :<a target='_blank' href='/uploads/${f.file.url}'
            download='${f.file.filename}'>${f.file.filename}</a>
            </li>
        `);
}
