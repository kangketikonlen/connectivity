// Inisialisasi variabel yang digunakan
const serverUrl = "https://api-connectivity.fathtech.com"
const loadingIndicator = document.getElementById('loading-indicator');
const connectivityTimestamp = document.getElementById('connectivity-timestamp');
const connectivityContainer = document.getElementById('connectivity-container');

// Fungsi untuk mengonversi tanggal ke format yang diinginkan
function convert_date(dateStr) {
	// Membuat objek date dengan parameter dateStr
	const dateObj = new Date(dateStr);
	// Membuat array untuk nama-nama hari dan bulan
	const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
	const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
	// Mendapatkan nama hari dan bulan dari objek date
	const day = days[dateObj.getDay()];
	const date = dateObj.getDate();
	const month = months[dateObj.getMonth()];
	const year = dateObj.getFullYear();
	// Mendapatkan jam, menit, dan detik dari objek date
	const hour = dateObj.getHours().toString().padStart(2, '0');
	const minute = dateObj.getMinutes().toString().padStart(2, '0');
	const second = dateObj.getSeconds().toString().padStart(2, '0');
	// Menggabungkan semua informasi waktu ke dalam satu string
	const formattedDate = `${day}, ${date} ${month} ${year}. Pukul ${hour}:${minute}:${second}`;

	return formattedDate;
}

// Fungsi untuk mengambil data dari server
async function fetchData() {
	try {
		const response = await fetch(serverUrl);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
	}
}

// Fungsi untuk mengecek status koneksi ke server tertentu
async function checkServerStatus(index) {
	try {
		const response = await fetch(`${serverUrl}/single-check/${index}`);
		const data = await response.json();
		return data.connectivity;
	} catch (error) {
		console.error(error);
	}
}

// Fungsi untuk mengupdate data koneksi ke server
async function updateConnectivityData() {
	// Mengambil data dari server
	const data = await fetchData();
	// Sort the servers array
	const servers = data.server;
	// Loop through the sorted servers array
	const sortedConnectivity = servers.map((server) => {
		return data.connectivity.find((connection) => {
			return `https://${connection.server}` === server;
		});
	});
	// Menghapus container lama jika ada
	const oldContainers = connectivityContainer.querySelectorAll('.col-lg-4');
	oldContainers.forEach(container => {
		container.remove();
	});
	// Menampilkan indikator loading
	loadingIndicator.style.display = 'flex';
	// Menampilkan timestamp terbaru
	connectivityTimestamp.textContent = convert_date(data.timestamp);
	// Menampilkan status koneksi ke setiap server
	sortedConnectivity.forEach((item, index) => {
		const connectivityChild = document.createElement('div');
		connectivityChild.setAttribute('id', item.server);
		connectivityChild.classList.add('col-lg-4');
		if (connectivityChild) {
			// Menampilkan status koneksi
			connectivityChild.innerHTML = `
				<div class="alert alert-${item.status ? 'success' : 'danger'} text-center">
				<h5 class="alert-heading">${item.server}</h5>
				<hr class="bg-white" />
				<span>${item.message}</span><br />
				<div class="text-center font-weight-bold">${convert_date(data.timestamp)}</div>
				</div>
			`;
			setInterval(() => {
				// Mengecek kembali status koneks
				checkServerStatus(index).then(connectivity => {
					connectivityChild.innerHTML = `
						<div class="alert alert-${connectivity.status ? 'success' : 'danger'} text-center">
						<h5 class="alert-heading">${connectivity.server}</h5>
						<hr class="bg-white" />
						<span>${connectivity.message}</span><br />
						<div class="text-center font-weight-bold">${convert_date(data.timestamp)}</div>
						</div>
					`;
				});
			}, 10000);
		}
		connectivityContainer.appendChild(connectivityChild);
	});
	loadingIndicator.style.display = 'none';
}

updateConnectivityData();
setInterval(updateConnectivityData, 10000);