const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const QRCode = require('qrcode');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

// Initialize WhatsApp client
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// Path to tenant data file
const TENANT_DATA_FILE = path.join(__dirname, 'tenants.json');

// Load tenant data
function loadTenants() {
    try {
        if (fs.existsSync(TENANT_DATA_FILE)) {
            const data = fs.readFileSync(TENANT_DATA_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading tenant data:', error);
    }
    return {};
}

// Save tenant data
function saveTenants(tenants) {
    try {
        fs.writeFileSync(TENANT_DATA_FILE, JSON.stringify(tenants, null, 2));
    } catch (error) {
        console.error('Error saving tenant data:', error);
    }
}

// Calculate days remaining
function getDaysRemaining(endDate) {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// Calculate days of stay
function getDaysOfStay(startDate) {
    const today = new Date();
    const start = new Date(startDate);
    const diffTime = today - start;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// Format date to Indonesian format
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
}

// Format currency to Indonesian Rupiah
function formatCurrency(amount) {
    return `Rp ${amount.toLocaleString('id-ID')}`;
}

// Generate reminder message
function generateReminderMessage(tenant) {
    const daysRemaining = getDaysRemaining(tenant.endDate);
    const daysOfStay = getDaysOfStay(tenant.startDate);
    const startDate = formatDate(tenant.startDate);
    const endDate = formatDate(tenant.endDate);
    const nextPayment = formatDate(tenant.nextPaymentDate);
    const paymentAmount = formatCurrency(tenant.monthlyRent);

    let message = `🏠 *Pengingat Kost Harian* 🏠\n\n`;
    message += `Halo ${tenant.name}! 👋\n\n`;
    message += `📅 *Informasi Masa Tinggal:*\n`;
    message += `• Mulai tinggal: ${startDate}\n`;
    message += `• Sampai: ${endDate}\n`;
    message += `• Lama tinggal: ${daysOfStay} hari\n`;
    message += `• Sisa waktu: ${daysRemaining} hari\n\n`;
    message += `💰 *Informasi Pembayaran:*\n`;
    message += `• Pembayaran berikutnya: ${nextPayment}\n`;
    message += `• Jumlah: ${paymentAmount}\n\n`;
    
    if (daysRemaining <= 7 && daysRemaining > 0) {
        message += `⚠️ *Perhatian:* Masa tinggal Anda akan berakhir dalam ${daysRemaining} hari!\n\n`;
    }
    
    const daysUntilPayment = getDaysRemaining(tenant.nextPaymentDate);
    if (daysUntilPayment <= 3 && daysUntilPayment > 0) {
        message += `⚠️ *Perhatian:* Pembayaran jatuh tempo dalam ${daysUntilPayment} hari!\n\n`;
    }
    
    message += `📱 *Perintah yang tersedia:*\n`;
    message += `• !pay - Lihat QR code pembayaran\n`;
    message += `• !complain - Kirim keluhan\n`;
    message += `• !info - Lihat informasi lengkap\n`;
    
    return message;
}

// QR code event
client.on('qr', (qr) => {
    console.log('Scan QR code ini untuk login:');
    qrcode.generate(qr, { small: true });
});

// Ready event
client.on('ready', () => {
    console.log('Bot WhatsApp siap!');
    console.log('Bot berhasil terhubung ke WhatsApp Web');
    
    // Schedule daily reminders at 9:00 AM
    cron.schedule('0 9 * * *', () => {
        console.log('Mengirim pengingat harian...');
        sendDailyReminders();
    });
    
    console.log('Pengingat harian dijadwalkan untuk pukul 09:00 setiap hari');
});

// Send daily reminders to all tenants
async function sendDailyReminders() {
    const tenants = loadTenants();
    
    for (const [phoneNumber, tenant] of Object.entries(tenants)) {
        try {
            const message = generateReminderMessage(tenant);
            await client.sendMessage(phoneNumber, message);
            console.log(`Pengingat terkirim ke ${tenant.name} (${phoneNumber})`);
        } catch (error) {
            console.error(`Error mengirim pengingat ke ${phoneNumber}:`, error);
        }
    }
}

// Message event handler
client.on('message', async (message) => {
    const chat = await message.getChat();
    const sender = message.from;
    const body = message.body.trim();
    
    console.log(`Pesan dari ${sender}: ${body}`);
    
    // Load tenant data
    const tenants = loadTenants();
    const tenant = tenants[sender];
    
    // Command: !pay
    if (body.toLowerCase() === '!pay') {
        const paymentInfo = `BANK: BCA\nNomor Rekening: 1234567890\nAtas Nama: Kost Koko`;
        
        try {
            // Generate QR code for payment
            const qrCodeData = await QRCode.toDataURL(paymentInfo);
            const base64Data = qrCodeData.split(',')[1];
            const buffer = Buffer.from(base64Data, 'base64');
            
            // Create media from buffer
            const { MessageMedia } = require('whatsapp-web.js');
            const media = new MessageMedia('image/png', base64Data);
            
            let paymentMessage = `💳 *Informasi Pembayaran Kost* 💳\n\n`;
            
            if (tenant) {
                paymentMessage += `Nama: ${tenant.name}\n`;
                paymentMessage += `Jumlah: ${formatCurrency(tenant.monthlyRent)}\n`;
                paymentMessage += `Jatuh tempo: ${formatDate(tenant.nextPaymentDate)}\n\n`;
            }
            
            paymentMessage += `🏦 *Detail Pembayaran:*\n`;
            paymentMessage += `• Bank: BCA\n`;
            paymentMessage += `• No. Rekening: 1234567890\n`;
            paymentMessage += `• Atas Nama: Kost Koko\n\n`;
            paymentMessage += `Scan QR code di bawah atau transfer manual ke rekening di atas.\n\n`;
            paymentMessage += `Mohon konfirmasi setelah pembayaran dengan mengirim bukti transfer.`;
            
            await client.sendMessage(sender, media, { caption: paymentMessage });
            console.log(`QR code pembayaran terkirim ke ${sender}`);
        } catch (error) {
            console.error('Error membuat QR code:', error);
            await message.reply('Maaf, terjadi kesalahan saat membuat QR code pembayaran.');
        }
    }
    
    // Command: !complain
    else if (body.toLowerCase() === '!complain') {
        let complainMessage = `📝 *Sistem Keluhan* 📝\n\n`;
        complainMessage += `Silakan kirim keluhan Anda dengan format:\n\n`;
        complainMessage += `!complain [keluhan Anda]\n\n`;
        complainMessage += `Contoh:\n`;
        complainMessage += `!complain AC di kamar rusak\n\n`;
        complainMessage += `Keluhan Anda akan segera ditindaklanjuti oleh pengelola kost.`;
        
        await message.reply(complainMessage);
    }
    
    // Command: !complain with message
    else if (body.toLowerCase().startsWith('!complain ')) {
        const complaint = body.substring(10).trim();
        
        if (complaint) {
            // Save complaint to file
            const complaintData = {
                from: sender,
                name: tenant ? tenant.name : 'Unknown',
                complaint: complaint,
                timestamp: new Date().toISOString()
            };
            
            const complaintsFile = path.join(__dirname, 'complaints.json');
            let complaints = [];
            
            try {
                if (fs.existsSync(complaintsFile)) {
                    const data = fs.readFileSync(complaintsFile, 'utf8');
                    complaints = JSON.parse(data);
                }
            } catch (error) {
                console.error('Error loading complaints:', error);
            }
            
            complaints.push(complaintData);
            
            try {
                fs.writeFileSync(complaintsFile, JSON.stringify(complaints, null, 2));
            } catch (error) {
                console.error('Error saving complaint:', error);
            }
            
            let responseMessage = `✅ *Keluhan Diterima* ✅\n\n`;
            responseMessage += `Terima kasih atas keluhan Anda:\n`;
            responseMessage += `"${complaint}"\n\n`;
            responseMessage += `Keluhan Anda telah dicatat dan akan segera ditindaklanjuti oleh pengelola kost.\n`;
            responseMessage += `Kami akan menghubungi Anda segera.`;
            
            await message.reply(responseMessage);
            console.log(`Keluhan dari ${sender}: ${complaint}`);
        } else {
            await message.reply('Mohon sertakan keluhan Anda setelah perintah !complain');
        }
    }
    
    // Command: !info
    else if (body.toLowerCase() === '!info') {
        if (tenant) {
            const infoMessage = generateReminderMessage(tenant);
            await message.reply(infoMessage);
        } else {
            await message.reply('Maaf, data Anda tidak ditemukan dalam sistem. Silakan hubungi pengelola kost.');
        }
    }
    
    // Command: !help
    else if (body.toLowerCase() === '!help') {
        let helpMessage = `🤖 *Bantuan Bot Kost Koko* 🤖\n\n`;
        helpMessage += `Perintah yang tersedia:\n\n`;
        helpMessage += `• !info - Lihat informasi lengkap masa tinggal dan pembayaran\n`;
        helpMessage += `• !pay - Lihat QR code dan informasi pembayaran\n`;
        helpMessage += `• !complain [pesan] - Kirim keluhan kepada pengelola\n`;
        helpMessage += `• !help - Tampilkan bantuan ini\n\n`;
        helpMessage += `Anda akan menerima pengingat otomatis setiap hari pukul 09:00 tentang informasi masa tinggal dan pembayaran.`;
        
        await message.reply(helpMessage);
    }
});

// Error handler
client.on('auth_failure', (msg) => {
    console.error('Autentikasi gagal:', msg);
});

client.on('disconnected', (reason) => {
    console.log('Bot terputus:', reason);
});

// Initialize client
console.log('Memulai bot WhatsApp...');
client.initialize();
