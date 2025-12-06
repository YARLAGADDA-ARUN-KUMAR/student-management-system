let students = [];
let users = [];
let logs = [];
let currentUser = null;
let userToChangePwd = null;

document.addEventListener('DOMContentLoaded', function () {
    const dateElem = document.getElementById('current-date');
    if (dateElem) {
        dateElem.innerText = new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }
    loadData();
    const sessionUser = sessionStorage.getItem('sms_user');
    if (sessionUser) {
        currentUser = JSON.parse(sessionUser);
        initializeDashboard();
    }
});

function loadData() {
    const sData = localStorage.getItem('sms_students');
    const uData = localStorage.getItem('sms_users');
    const lData = localStorage.getItem('sms_logs');
    students = sData ? JSON.parse(sData) : [];
    logs = lData ? JSON.parse(lData) : [];
    if (uData) {
        users = JSON.parse(uData);
    } else {
        users = [{ username: 'admin', password: 'admin123', role: 'ADMIN' }];
        saveUsers();
    }
}

function saveData() {
    localStorage.setItem('sms_students', JSON.stringify(students));
}

function saveUsers() {
    localStorage.setItem('sms_users', JSON.stringify(users));
}

function logEvent(action, status) {
    const time = new Date().toLocaleString();
    const user = currentUser ? currentUser.username : 'SYSTEM';
    const logEntry =
        '[' + time + '] User: ' + user + ' | Action: ' + action + ' | Status: ' + status;
    logs.unshift(logEntry);
    if (logs.length > 100) logs.pop();
    localStorage.setItem('sms_logs', JSON.stringify(logs));
    renderLogs();
}

function handleLogin(e) {
    e.preventDefault();

    const uInput = document.getElementById('username').value;
    const pInput = document.getElementById('password').value;
    const err = document.getElementById('login-error');

    const user = users.find(function (u) {
        return u.username === uInput && u.password === pInput;
    });

    if (user) {
        currentUser = user;
        sessionStorage.setItem('sms_user', JSON.stringify(user));
        logEvent('LOGIN', 'Success');

        if (err) err.classList.add('hidden');

        // changed: use relative path so sessionStorage stays valid for the same origin/path
        window.location.href = 'portal.html';
    } else {
        logEvent('LOGIN', 'Failed - User: ' + uInput);
        if (err) err.classList.remove('hidden');
    }
}

function handleLogout() {
    logEvent('LOGOUT', 'Success');
    currentUser = null;
    sessionStorage.removeItem('sms_user');
    document.getElementById('dashboard-section').classList.add('hidden-section');
    document.getElementById('login-section').classList.remove('hidden-section');
    document.getElementById('login-form').reset();
    document.getElementById('login-error').classList.add('hidden');
}

function initializeDashboard() {
    document.getElementById('login-section').classList.add('hidden-section');
    document.getElementById('dashboard-section').classList.remove('hidden-section');
    document.getElementById('user-role-display').innerText = currentUser.role;
    document.getElementById('current-username').innerText = 'Logged in as: ' + currentUser.username;
    const adminLinks = document.getElementById('admin-links');
    const addBtn = document.getElementById('add-student-btn');
    const backupBtn = document.getElementById('backup-btn');
    adminLinks.classList.add('hidden');
    addBtn.classList.add('hidden');
    backupBtn.classList.add('hidden');
    if (currentUser.role === 'ADMIN') {
        adminLinks.classList.remove('hidden');
        addBtn.classList.remove('hidden');
        backupBtn.classList.remove('hidden');
    }
    switchView('view-students');
    renderTable();
    renderLogs();
}

function switchView(viewId) {
    document.querySelectorAll('.content-view').forEach(function (el) {
        el.classList.add('hidden-section');
    });
    document.getElementById(viewId).classList.remove('hidden-section');
    const titles = {
        'view-students': 'Student Records',
        statistics: 'Statistics Dashboard',
        'manage-users': 'User Management',
        'system-logs': 'System Activity Logs',
    };
    document.getElementById('page-title').innerText = titles[viewId];
    if (viewId === 'statistics') calculateStats();
    if (viewId === 'manage-users') renderUserTable();
    document.querySelectorAll('.nav-btn').forEach(function (btn) {
        btn.classList.remove('nav-btn-active');
    });
    if (viewId === 'view-students') {
        document.querySelectorAll('.nav-btn')[0].classList.add('nav-btn-active');
    } else if (viewId === 'statistics') {
        document.querySelectorAll('.nav-btn')[1].classList.add('nav-btn-active');
    } else if (viewId === 'manage-users') {
        document.querySelectorAll('#admin-links .nav-btn')[0].classList.add('nav-btn-active');
    } else if (viewId === 'system-logs') {
        document.querySelectorAll('#admin-links .nav-btn')[1].classList.add('nav-btn-active');
    }
}

function getGrade(marks) {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'B';
    if (marks >= 60) return 'C';
    if (marks >= 50) return 'D';
    return 'F';
}

function renderTable(data) {
    const list = data || students;
    const tbody = document.getElementById('students-table-body');
    const noData = document.getElementById('no-data-msg');
    tbody.innerHTML = '';
    if (list.length === 0) {
        noData.classList.remove('hidden');
        return;
    } else {
        noData.classList.add('hidden');
    }
    list.forEach(function (s) {
        const grade = getGrade(s.marks);
        const isFail = grade === 'F';
        const gradeClass = isFail ? 'grade-pill grade-pill-fail' : 'grade-pill grade-pill-pass';
        let actions = '';
        if (currentUser.role === 'ADMIN') {
            actions =
                '<button onclick="editStudent(\'' +
                s.roll +
                '\', false)" class="btn-link" title="Edit"><i class="fas fa-edit"></i></button>' +
                '<button onclick="deleteStudent(\'' +
                s.roll +
                '\')" class="btn-link" title="Delete"><i class="fas fa-trash"></i></button>';
        } else if (currentUser.role === 'STAFF') {
            actions =
                '<button onclick="editStudent(\'' +
                s.roll +
                '\', true)" class="btn-link" title="Update Marks Only"><i class="fas fa-marker"></i></button>';
        } else {
            actions = '<span style="font-size:11px;color:#9ca3af;">View Only</span>';
        }
        const row =
            '<tr class="table-row-hover">' +
            '<td><span style="font-family:monospace;">' +
            s.roll +
            '</span></td>' +
            '<td><span style="font-weight:600;">' +
            s.name +
            '</span></td>' +
            '<td>' +
            parseFloat(s.marks).toFixed(2) +
            '</td>' +
            '<td><span class="' +
            gradeClass +
            '">' +
            grade +
            '</span></td>' +
            '<td class="text-right">' +
            actions +
            '</td>' +
            '</tr>';
        tbody.innerHTML += row;
    });
}

function handleSearch() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const filtered = students.filter(function (s) {
        return s.name.toLowerCase().includes(query) || s.roll.toLowerCase().includes(query);
    });
    renderTable(filtered);
}

function toggleFilterMode() {
    const el = document.getElementById('advanced-filter');
    el.classList.toggle('hidden');
}

function applyMarksFilter() {
    const minVal = document.getElementById('filter-min').value;
    const maxVal = document.getElementById('filter-max').value;
    const min = minVal === '' ? 0 : parseFloat(minVal);
    const max = maxVal === '' ? 100 : parseFloat(maxVal);
    const filtered = students.filter(function (s) {
        return s.marks >= min && s.marks <= max;
    });
    renderTable(filtered);
    logEvent('SEARCH_BY_MARKS', 'Range ' + min + '-' + max);
}

function resetFilters() {
    document.getElementById('filter-min').value = '';
    document.getElementById('filter-max').value = '';
    document.getElementById('search-input').value = '';
    renderTable();
}

function handleSort() {
    const criteria = document.getElementById('sort-select').value;
    const sorted = students.slice();
    if (criteria === 'roll') {
        sorted.sort(function (a, b) {
            return a.roll.localeCompare(b.roll);
        });
    } else if (criteria === 'name') {
        sorted.sort(function (a, b) {
            return a.name.localeCompare(b.name);
        });
    } else if (criteria === 'marks-desc') {
        sorted.sort(function (a, b) {
            return b.marks - a.marks;
        });
    } else if (criteria === 'marks-asc') {
        sorted.sort(function (a, b) {
            return a.marks - b.marks;
        });
    }
    renderTable(sorted);
}

function openModal(id) {
    const modal = document.getElementById(id);
    modal.classList.remove('hidden');
    if (id === 'student-modal') {
        document.getElementById('student-form').reset();
        document.getElementById('student-modal-title').innerText = 'Add Student';
        document.getElementById('edit-mode').value = 'false';
        const r = document.getElementById('s-roll');
        const n = document.getElementById('s-name');
        r.disabled = false;
        n.disabled = false;
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    modal.classList.add('hidden');
}

function handleSaveStudent(e) {
    e.preventDefault();
    const roll = document.getElementById('s-roll').value.trim();
    const name = document.getElementById('s-name').value.trim();
    const marks = parseFloat(document.getElementById('s-marks').value);
    const isEdit = document.getElementById('edit-mode').value === 'true';
    if (!isEdit) {
        const exists = students.some(function (s) {
            return s.roll === roll;
        });
        if (exists) {
            alert('Roll number already exists!');
            return;
        }
        students.push({ roll: roll, name: name, marks: marks });
        logEvent('ADD_STUDENT', 'Success (' + roll + ')');
    } else {
        const index = students.findIndex(function (s) {
            return s.roll === roll;
        });
        if (index !== -1) {
            students[index].name = name;
            students[index].marks = marks;
            logEvent('UPDATE_STUDENT', 'Success (' + roll + ')');
        }
    }
    saveData();
    closeModal('student-modal');
    renderTable();
}

function editStudent(roll, marksOnly) {
    const student = students.find(function (s) {
        return s.roll === roll;
    });
    if (!student) return;
    openModal('student-modal');
    document.getElementById('student-modal-title').innerText = marksOnly
        ? 'Update Marks'
        : 'Edit Student';
    document.getElementById('edit-mode').value = 'true';
    const rInput = document.getElementById('s-roll');
    const nInput = document.getElementById('s-name');
    const mInput = document.getElementById('s-marks');
    rInput.value = student.roll;
    rInput.disabled = true;
    nInput.value = student.name;
    mInput.value = student.marks;
    if (marksOnly) {
        nInput.disabled = true;
    } else {
        nInput.disabled = false;
    }
}

function deleteStudent(roll) {
    if (confirm('Are you sure you want to delete student with Roll ' + roll + '?')) {
        students = students.filter(function (s) {
            return s.roll !== roll;
        });
        saveData();
        renderTable();
        logEvent('DELETE_STUDENT', 'Success (' + roll + ')');
    }
}

function calculateStats() {
    if (students.length === 0) {
        document.getElementById('stat-total').innerText = '0';
        document.getElementById('stat-avg').innerText = '0';
        document.getElementById('stat-high').innerText = '0';
        document.getElementById('stat-low').innerText = '0';
        document.getElementById('grade-bars').innerHTML = '';
        return;
    }
    const total = students.length;
    const sum = students.reduce(function (acc, curr) {
        return acc + curr.marks;
    }, 0);
    const avg = (sum / total).toFixed(2);
    const high = Math.max.apply(
        null,
        students.map(function (s) {
            return s.marks;
        }),
    );
    const low = Math.min.apply(
        null,
        students.map(function (s) {
            return s.marks;
        }),
    );
    document.getElementById('stat-total').innerText = String(total);
    document.getElementById('stat-avg').innerText = String(avg);
    document.getElementById('stat-high').innerText = String(high);
    document.getElementById('stat-low').innerText = String(low);
    const counts = { 'A+': 0, A: 0, B: 0, C: 0, D: 0, F: 0 };
    students.forEach(function (s) {
        const g = getGrade(s.marks);
        if (counts[g] !== undefined) counts[g]++;
    });
    const barsContainer = document.getElementById('grade-bars');
    barsContainer.innerHTML = '';
    Object.keys(counts).forEach(function (grade) {
        const count = counts[grade];
        const percentage = total > 0 ? (count / total) * 100 : 0;
        let barClass = 'grade-bar-blue';
        if (grade === 'A+') barClass = 'grade-bar-green';
        if (grade === 'F') barClass = 'grade-bar-red';
        const row =
            '<div class="grade-bars-row">' +
            '<div class="grade-bar-label">' +
            '<span>' +
            grade +
            '</span>' +
            '<span>' +
            count +
            '</span>' +
            '</div>' +
            '<div class="grade-bar-track">' +
            '<div class="grade-bar-fill ' +
            barClass +
            '" style="width:' +
            percentage +
            '%;"></div>' +
            '</div>' +
            '</div>';
        barsContainer.innerHTML += row;
    });
    logEvent('STATISTICS', 'Viewed');
}

function renderUserTable() {
    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = '';
    users.forEach(function (u) {
        const canDelete = u.username !== 'admin';
        const row =
            '<tr class="table-row-hover">' +
            '<td>' +
            u.username +
            '</td>' +
            '<td><span class="role-pill">' +
            u.role +
            '</span></td>' +
            '<td class="text-right">' +
            '<button onclick="promptPasswordChange(\'' +
            u.username +
            '\')" class="btn-link" style="font-size:12px;">Change Pwd</button>' +
            (canDelete
                ? '<button onclick="deleteUser(\'' +
                  u.username +
                  '\')" class="btn-link" style="font-size:12px;color:#dc2626;">Delete</button>'
                : '') +
            '</td>' +
            '</tr>';
        tbody.innerHTML += row;
    });
}

function handleAddUser(e) {
    e.preventDefault();
    const u = document.getElementById('u-username').value.trim();
    const p = document.getElementById('u-password').value.trim();
    const r = document.getElementById('u-role').value;
    if (
        users.some(function (user) {
            return user.username === u;
        })
    ) {
        alert('Username taken');
        return;
    }
    users.push({ username: u, password: p, role: r });
    saveUsers();
    closeModal('user-modal');
    renderUserTable();
    logEvent('ADD_USER', 'Added ' + u + ' as ' + r);
}

function deleteUser(username) {
    if (confirm('Delete user ' + username + '?')) {
        users = users.filter(function (u) {
            return u.username !== username;
        });
        saveUsers();
        renderUserTable();
        logEvent('DELETE_USER', username);
    }
}

function promptPasswordChange(username) {
    userToChangePwd = username;
    document.getElementById('pwd-username').innerText = username;
    document.getElementById('new-password-input').value = '';
    openModal('pwd-modal');
}

function confirmPasswordChange() {
    const newPwd = document.getElementById('new-password-input').value.trim();
    if (!newPwd) return;
    const u = users.find(function (u) {
        return u.username === userToChangePwd;
    });
    if (u) {
        u.password = newPwd;
        saveUsers();
        closeModal('pwd-modal');
        alert('Password updated');
        logEvent('CHANGE_PASSWORD', userToChangePwd);
    }
}

function renderLogs() {
    const container = document.getElementById('log-container');
    if (!container) return;
    container.innerHTML = logs
        .map(function (l) {
            return '<div>' + l + '</div>';
        })
        .join('');
}

function backupData() {
    const data = {
        students: students,
        timestamp: new Date().toISOString(),
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', 'student_backup_' + new Date().getTime() + '.json');
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    logEvent('BACKUP', 'Downloaded');
}
