const params = window.location.search;
const taskId = new URLSearchParams(params).get('id');
const taskName = document.querySelector('.task-edit-name');
const taskCompleted = document.querySelector('.task-edit-completed');

console.log('タスクID:', taskId);

const showTasks = async () => {
    try {
        const { data: { task } } = await axios.get(`/api/v1/tasks/${taskId}`);
        console.log('取得したタスク:', task);
        const { _id, name, completed } = task;
        
        // DOM要素を取得
        const taskIdElement = document.querySelector('.task-id');
        const taskNameElement = document.querySelector('.task-edit-name');
        const taskCompletedElement = document.querySelector('.task-edit-completed');
        
        console.log('DOM要素確認:');
        console.log('taskIdElement:', taskIdElement);
        console.log('taskNameElement:', taskNameElement);
        console.log('taskCompletedElement:', taskCompletedElement);
        
        // 値を設定
        if (taskIdElement) taskIdElement.textContent = _id;
        if (taskNameElement) taskNameElement.value = name;
        if (taskCompletedElement) taskCompletedElement.checked = completed;
        
        // 完了状態トグル機能を設定
        setupCompletedToggle();
        
    } catch (error) {
        console.error('Error fetching the task:', error);
    }
};

showTasks();

// チェックボックスの変更を監視して取り消し線を追加/削除
const setupCompletedToggle = () => {
    const taskNameElement = document.querySelector('.task-edit-name');
    const taskCompletedElement = document.querySelector('.task-edit-completed');
    
    if (taskCompletedElement && taskNameElement) {
        // 初期状態の設定
        const updateTaskNameStyle = () => {
            if (taskCompletedElement.checked) {
                taskNameElement.classList.add('completed');
            } else {
                taskNameElement.classList.remove('completed');
            }
        };
        
        // 初期状態を設定
        updateTaskNameStyle();
        
        // チェックボックスの変更を監視
        taskCompletedElement.addEventListener('change', updateTaskNameStyle);
        
        console.log('完了状態トグル機能を設定しました');
    }
};

// タスクの更新を処理する
const formDOM = document.querySelector('.single-task-form');
const formAlertDOM = document.querySelector('.form-alert');

console.log('フォーム要素確認:');
console.log('formDOM:', formDOM);
console.log('formAlertDOM:', formAlertDOM);

formDOM.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
        const taskNameValue = taskName.value;
        const taskCompletedValue = taskCompleted.checked;
        console.log('送信するデータ:', { name: taskNameValue, completed: taskCompletedValue });
        
        const { data: { task } } = await axios.patch(`/api/v1/tasks/${taskId}`, {
            name: taskNameValue,
            completed: taskCompletedValue
        });
        
        console.log('更新されたタスク:', task);
        if (formAlertDOM) {
            formAlertDOM.style.display = 'block';
            formAlertDOM.textContent = 'タスクが正常に更新されました';
            formAlertDOM.classList.remove('text-error');
            formAlertDOM.classList.add('text-success');
        }
        
    } catch (error) {
        console.error('Error updating the task:', error);
        console.error('Error details:', error.response?.data);
        if (formAlertDOM) {
            formAlertDOM.style.display = 'block';
            const errorMessage = error.response?.data?.message || 'タスクの更新に失敗しました';
            formAlertDOM.textContent = `エラー: ${errorMessage}`;
            formAlertDOM.classList.remove('text-success');
            formAlertDOM.classList.add('text-error');
        }
    } finally {
        setTimeout(() => {
            if (formAlertDOM) {
                formAlertDOM.style.display = 'none';
                formAlertDOM.classList.remove('text-success', 'text-error');
            }
        }, 3000);
    }
});