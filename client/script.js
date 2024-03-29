todoForm.title.addEventListener('keyup', (e) => validateField(e.target));
todoForm.title.addEventListener('blur', (e) => validateField(e.target));
todoForm.description.addEventListener('input', (e) => validateField(e.target));
todoForm.description.addEventListener('blur', (e) => validateField(e.target));
todoForm.dueDate.addEventListener('input', (e) => validateField(e.target));
todoForm.dueDate.addEventListener('blur', (e) => validateField(e.target));

todoForm.addEventListener('submit', onSubmit);

const todoListElement = document.getElementById('todoList');

let titleValid = true;
let descriptionValid = true;
let dueDateValid = true;

const api = new Api('http://localhost:5000/tasks');

function validateField(field) {
  const { name, value } = field;

  let = validationMessage = '';

  switch (name) {
    case 'title': {
      if (value.length < 2) {
        titleValid = false;
        validationMessage = "Fältet 'Titel' måste innehålla minst 2 tecken.";
      } else if (value.length > 100) {
        titleValid = false;
        validationMessage = "Fältet 'Titel' får inte innehålla mer än 100 tecken.";
      } else {
        titleValid = true;
      }
      break;
    }
    case 'description': {
      if (value.length > 500) {
        descriptionValid = false;
        validationMessage = "Fältet 'Beskrvining' får inte innehålla mer än 500 tecken.";
      } else {
        descriptionValid = true;
      }
      break;
    }
    case 'dueDate': {
      if (value.length === 0) {
        dueDateValid = false;
        validationMessage = "Fältet 'Slutförd senast' är obligatorisk.";
      } else {
        dueDateValid = true;
      }
      break;
    }
  }

  field.previousElementSibling.innerText = validationMessage;
  field.previousElementSibling.classList.remove('hidden');
}

function onSubmit(e) {
  e.preventDefault();
  if (titleValid && descriptionValid && dueDateValid) {
    console.log('Submit');
    saveTask();
  }
}

function saveTask() {
  const task = {
    title: todoForm.title.value,
    description: todoForm.description.value,
    dueDate: todoForm.dueDate.value,
    completed: false
  };

  api.create(task).then((task) => {
    if (task) {
      renderList();
    }
  });
}

function renderList() {
  console.log('rendering');
  api.getAll().then((tasks) => {
    todoListElement.innerHTML = '';
    if (tasks && tasks.length > 0) {
      tasks.forEach((task) => {
        todoListElement.insertAdjacentHTML('beforeend', renderTask(task));
      });
    }
  });
}

function renderTask({ id, title, description, dueDate, completed }) {
  let html = `
    <li class="select-none mt-2 py-2 border-b border-red-300">
      <div class="flex items-center">
        <h3 class="mb-3 flex-1 text-xl font-bold text-emerald-900 uppercase">
          ${completed ? '<span class="text-green-700 mr-4">&check;</span>' + title : title}
        </h3>
        <div>
          <span>${dueDate}</span>
          <div class="inline-block bg-emerald-600 text-xs border border-emerald p-0 rounded-md ml-2">
            <input ${completed ? 'checked="true"' : ''} onchange="toggleCompleted(${id}, event.target.checked)" class="ml-2 checked:bg-green-900" type="checkbox" id="check${id}" name="check${id}">
            <label class="inline-block -ml-6 pl-6 pr-3 py-1" for="check${id}">Markera som klar</label>
          </div>
          <button onclick="deleteTask(${id})" class="inline-block bg-red-300 text-xs text-black border border-white px-3 py-1 rounded-md ml-2">Ta bort</button>
        </div>
      </div>`;
  description &&
    (html += `
      <p class="ml-8 mt-2 text-xs italic">${description}</p>
  `);
  html += `
    </li>`;

  return html;
}

function deleteTask(id) {
  api.remove(id).then((result) => {
    renderList();
  });
}

function toggleCompleted(id, completed) {
  console.log(completed);
  api.saveCompleted(id, { completed }).then((result) => {
    renderList();
  });
}

renderList();
