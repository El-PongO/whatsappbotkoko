const fs = require('fs');
const path = require('path');

// Utility functions for managing tenant data and viewing complaints

// Load tenant data
function loadTenants() {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'tenants.json'), 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading tenants:', error);
        return {};
    }
}

// Save tenant data
function saveTenants(tenants) {
    try {
        fs.writeFileSync(
            path.join(__dirname, 'tenants.json'), 
            JSON.stringify(tenants, null, 2)
        );
        console.log('✅ Tenant data saved successfully');
        return true;
    } catch (error) {
        console.error('❌ Error saving tenants:', error);
        return false;
    }
}

// Load complaints
function loadComplaints() {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'complaints.json'), 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading complaints:', error);
        return [];
    }
}

// Add new tenant
function addTenant(phoneNumber, tenantData) {
    const tenants = loadTenants();
    const formattedPhone = phoneNumber.includes('@c.us') ? phoneNumber : `${phoneNumber}@c.us`;
    
    tenants[formattedPhone] = {
        name: tenantData.name,
        startDate: tenantData.startDate,
        endDate: tenantData.endDate,
        nextPaymentDate: tenantData.nextPaymentDate,
        monthlyRent: tenantData.monthlyRent,
        roomNumber: tenantData.roomNumber || 'N/A'
    };
    
    if (saveTenants(tenants)) {
        console.log(`✅ Tenant ${tenantData.name} added successfully`);
        return true;
    }
    return false;
}

// Update tenant payment date
function updatePaymentDate(phoneNumber, newPaymentDate) {
    const tenants = loadTenants();
    const formattedPhone = phoneNumber.includes('@c.us') ? phoneNumber : `${phoneNumber}@c.us`;
    
    if (tenants[formattedPhone]) {
        tenants[formattedPhone].nextPaymentDate = newPaymentDate;
        if (saveTenants(tenants)) {
            console.log(`✅ Payment date updated for ${tenants[formattedPhone].name}`);
            return true;
        }
    } else {
        console.log(`❌ Tenant with phone ${formattedPhone} not found`);
    }
    return false;
}

// Remove tenant
function removeTenant(phoneNumber) {
    const tenants = loadTenants();
    const formattedPhone = phoneNumber.includes('@c.us') ? phoneNumber : `${phoneNumber}@c.us`;
    
    if (tenants[formattedPhone]) {
        const name = tenants[formattedPhone].name;
        delete tenants[formattedPhone];
        if (saveTenants(tenants)) {
            console.log(`✅ Tenant ${name} removed successfully`);
            return true;
        }
    } else {
        console.log(`❌ Tenant with phone ${formattedPhone} not found`);
    }
    return false;
}

// List all tenants
function listTenants() {
    const tenants = loadTenants();
    console.log('\n📋 LIST OF TENANTS\n');
    console.log('='.repeat(80));
    
    if (Object.keys(tenants).length === 0) {
        console.log('No tenants found.');
        return;
    }
    
    for (const [phone, tenant] of Object.entries(tenants)) {
        console.log(`\n👤 ${tenant.name}`);
        console.log(`   Phone: ${phone}`);
        console.log(`   Room: ${tenant.roomNumber}`);
        console.log(`   Start: ${tenant.startDate} | End: ${tenant.endDate}`);
        console.log(`   Next Payment: ${tenant.nextPaymentDate} | Amount: Rp ${tenant.monthlyRent.toLocaleString('id-ID')}`);
    }
    console.log('\n' + '='.repeat(80) + '\n');
}

// List all complaints
function listComplaints() {
    const complaints = loadComplaints();
    console.log('\n📝 LIST OF COMPLAINTS\n');
    console.log('='.repeat(80));
    
    if (complaints.length === 0) {
        console.log('No complaints found.');
        return;
    }
    
    complaints.forEach((complaint, index) => {
        const date = new Date(complaint.timestamp);
        console.log(`\n#${index + 1} - ${complaint.name} (${complaint.from})`);
        console.log(`   Date: ${date.toLocaleString('id-ID')}`);
        console.log(`   Complaint: "${complaint.complaint}"`);
    });
    console.log('\n' + '='.repeat(80) + '\n');
}

// Clear all complaints
function clearComplaints() {
    try {
        fs.writeFileSync(path.join(__dirname, 'complaints.json'), '[]');
        console.log('✅ All complaints cleared');
        return true;
    } catch (error) {
        console.error('❌ Error clearing complaints:', error);
        return false;
    }
}

// CLI interface
if (require.main === module) {
    const command = process.argv[2];
    
    switch(command) {
        case 'list':
            listTenants();
            break;
            
        case 'complaints':
            listComplaints();
            break;
            
        case 'add':
            // Example: node admin.js add 6281234567890 "John Doe" 2024-01-01 2024-12-31 2024-03-01 1500000 101
            const [_, __, ___, phone, name, startDate, endDate, nextPayment, rent, room] = process.argv;
            if (phone && name && startDate && endDate && nextPayment && rent) {
                addTenant(phone, {
                    name,
                    startDate,
                    endDate,
                    nextPaymentDate: nextPayment,
                    monthlyRent: parseInt(rent),
                    roomNumber: room || 'N/A'
                });
            } else {
                console.log('Usage: node admin.js add <phone> <name> <startDate> <endDate> <nextPayment> <rent> [room]');
            }
            break;
            
        case 'update-payment':
            // Example: node admin.js update-payment 6281234567890 2024-04-01
            const [_a, _b, _c, phoneNum, newDate] = process.argv;
            if (phoneNum && newDate) {
                updatePaymentDate(phoneNum, newDate);
            } else {
                console.log('Usage: node admin.js update-payment <phone> <newPaymentDate>');
            }
            break;
            
        case 'remove':
            // Example: node admin.js remove 6281234567890
            const phoneToRemove = process.argv[3];
            if (phoneToRemove) {
                removeTenant(phoneToRemove);
            } else {
                console.log('Usage: node admin.js remove <phone>');
            }
            break;
            
        case 'clear-complaints':
            clearComplaints();
            break;
            
        default:
            console.log('\n🔧 ADMIN TOOLS FOR KOST KOKO BOT\n');
            console.log('Available commands:');
            console.log('  node admin.js list                                          - List all tenants');
            console.log('  node admin.js complaints                                    - List all complaints');
            console.log('  node admin.js add <phone> <name> <start> <end> <payment> <rent> [room]');
            console.log('  node admin.js update-payment <phone> <newDate>             - Update payment date');
            console.log('  node admin.js remove <phone>                               - Remove tenant');
            console.log('  node admin.js clear-complaints                             - Clear all complaints');
            console.log('\nExamples:');
            console.log('  node admin.js list');
            console.log('  node admin.js add 6281234567890 "John Doe" 2024-01-01 2024-12-31 2024-03-01 1500000 101');
            console.log('  node admin.js update-payment 6281234567890 2024-04-01');
            console.log('  node admin.js complaints\n');
    }
}

module.exports = {
    loadTenants,
    saveTenants,
    loadComplaints,
    addTenant,
    updatePaymentDate,
    removeTenant,
    listTenants,
    listComplaints,
    clearComplaints
};
