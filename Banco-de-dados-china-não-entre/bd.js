// ============================================
// BANCO DE DADOS - BARBER APP
// Sistema completo de gerenciamento de dados
// usando localStorage do navegador
// ============================================

class BarberDatabase {
    constructor() {
        this.initializeDatabase();
    }

    // Inicializa o banco de dados
    initializeDatabase() {
        if (!localStorage.getItem('barberDB')) {
            const initialDB = {
                users: [],
                appointments: [],
                barbershops: [
                    {
                        id: 1,
                        name: "Barber Shop Premium",
                        location: "Centro, 1.2km",
                        rating: 4.9,
                        reviews: 234,
                        price: 45,
                        emoji: "💈",
                        services: [
                            { id: 1, name: "Corte Tradicional", price: 45, duration: 45 },
                            { id: 2, name: "Barba", price: 35, duration: 30 },
                            { id: 3, name: "Corte + Barba", price: 70, duration: 75 },
                            { id: 4, name: "Hidratação", price: 25, duration: 20 }
                        ],
                        workingHours: {
                            start: "09:00",
                            end: "19:00",
                            interval: 60 // minutos
                        }
                    },
                    {
                        id: 2,
                        name: "Estilo & Classe",
                        location: "Bairro Alto, 2.5km",
                        rating: 4.8,
                        reviews: 189,
                        price: 50,
                        emoji: "✂️",
                        services: [
                            { id: 1, name: "Corte Moderno", price: 50, duration: 45 },
                            { id: 2, name: "Degradê", price: 55, duration: 50 },
                            { id: 3, name: "Barba Completa", price: 40, duration: 35 },
                            { id: 4, name: "Combo Premium", price: 85, duration: 90 }
                        ],
                        workingHours: {
                            start: "09:00",
                            end: "19:00",
                            interval: 60
                        }
                    },
                    {
                        id: 3,
                        name: "Barbeiro do João",
                        location: "Vila Nova, 0.8km",
                        rating: 4.7,
                        reviews: 156,
                        price: 40,
                        emoji: "🪒",
                        services: [
                            { id: 1, name: "Corte Simples", price: 40, duration: 40 },
                            { id: 2, name: "Corte + Acabamento", price: 50, duration: 50 },
                            { id: 3, name: "Barba", price: 30, duration: 25 },
                            { id: 4, name: "Pacote Completo", price: 65, duration: 70 }
                        ],
                        workingHours: {
                            start: "09:00",
                            end: "19:00",
                            interval: 60
                        }
                    }
                ]
            };
            localStorage.setItem('barberDB', JSON.stringify(initialDB));
        }
    }

    // Obtém todo o banco de dados
    getDatabase() {
        return JSON.parse(localStorage.getItem('barberDB'));
    }

    // Salva o banco de dados
    saveDatabase(db) {
        localStorage.setItem('barberDB', JSON.stringify(db));
    }

    // ============================================
    // USUÁRIOS - CRUD
    // ============================================

    // Registrar novo usuário
    registerUser(userData) {
        const db = this.getDatabase();
        
        // Verificar se email já existe
        const existingUser = db.users.find(u => u.email === userData.email);
        if (existingUser) {
            return { success: false, message: "Email já cadastrado!" };
        }

        // Criar novo usuário
        const newUser = {
            id: Date.now(),
            name: userData.name,
            email: userData.email,
            password: userData.password, // Em produção, usar hash!
            phone: userData.phone || "",
            cpf: userData.cpf || "",
            createdAt: new Date().toISOString(),
            appointments: []
        };

        db.users.push(newUser);
        this.saveDatabase(db);

        return { 
            success: true, 
            message: "Usuário cadastrado com sucesso!",
            user: { id: newUser.id, name: newUser.name, email: newUser.email }
        };
    }

    // Login de usuário
    loginUser(email, password) {
        const db = this.getDatabase();
        
        const user = db.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Salvar sessão
            const session = {
                userId: user.id,
                name: user.name,
                email: user.email,
                loginAt: new Date().toISOString()
            };
            localStorage.setItem('currentUser', JSON.stringify(session));
            
            return { 
                success: true, 
                message: "Login realizado com sucesso!",
                user: { id: user.id, name: user.name, email: user.email }
            };
        }
        
        return { success: false, message: "Email ou senha incorretos!" };
    }

    // Logout
    logoutUser() {
        localStorage.removeItem('currentUser');
        return { success: true, message: "Logout realizado com sucesso!" };
    }

    // Obter usuário atual
    getCurrentUser() {
        const session = localStorage.getItem('currentUser');
        return session ? JSON.parse(session) : null;
    }

    // Verificar se está logado
    isLoggedIn() {
        return this.getCurrentUser() !== null;
    }

    // Buscar usuário por ID
    getUserById(userId) {
        const db = this.getDatabase();
        return db.users.find(u => u.id === userId);
    }

    // Atualizar dados do usuário
    updateUser(userId, updateData) {
        const db = this.getDatabase();
        const userIndex = db.users.findIndex(u => u.id === userId);
        
        if (userIndex === -1) {
            return { success: false, message: "Usuário não encontrado!" };
        }

        // Atualizar dados permitidos
        const allowedFields = ['name', 'phone', 'cpf'];
        allowedFields.forEach(field => {
            if (updateData[field] !== undefined) {
                db.users[userIndex][field] = updateData[field];
            }
        });

        this.saveDatabase(db);
        return { success: true, message: "Dados atualizados com sucesso!" };
    }

    // Alterar senha
    changePassword(userId, oldPassword, newPassword) {
        const db = this.getDatabase();
        const user = db.users.find(u => u.id === userId);
        
        if (!user) {
            return { success: false, message: "Usuário não encontrado!" };
        }

        if (user.password !== oldPassword) {
            return { success: false, message: "Senha atual incorreta!" };
        }

        user.password = newPassword;
        this.saveDatabase(db);
        return { success: true, message: "Senha alterada com sucesso!" };
    }

    // ============================================
    // AGENDAMENTOS - CRUD
    // ============================================

    // Criar novo agendamento
    createAppointment(appointmentData) {
        const db = this.getDatabase();
        const currentUser = this.getCurrentUser();

        if (!currentUser) {
            return { success: false, message: "Usuário não logado!" };
        }

        // Verificar se horário está disponível
        const isAvailable = this.checkAvailability(
            appointmentData.barbershopId,
            appointmentData.date,
            appointmentData.time
        );

        if (!isAvailable) {
            return { success: false, message: "Horário não disponível!" };
        }

        // Criar agendamento
        const newAppointment = {
            id: Date.now(),
            userId: currentUser.userId,
            barbershopId: appointmentData.barbershopId,
            serviceId: appointmentData.serviceId,
            serviceName: appointmentData.serviceName,
            date: appointmentData.date,
            time: appointmentData.time,
            price: appointmentData.price,
            status: "confirmado", // confirmado, cancelado, concluído
            createdAt: new Date().toISOString()
        };

        db.appointments.push(newAppointment);
        this.saveDatabase(db);

        return { 
            success: true, 
            message: "Agendamento realizado com sucesso!",
            appointment: newAppointment
        };
    }

    // Verificar disponibilidade
    checkAvailability(barbershopId, date, time) {
        const db = this.getDatabase();
        
        const existingAppointment = db.appointments.find(
            a => a.barbershopId === barbershopId && 
                 a.date === date && 
                 a.time === time &&
                 a.status === "confirmado"
        );

        return !existingAppointment;
    }

    // Obter agendamentos do usuário
    getUserAppointments(userId) {
        const db = this.getDatabase();
        const userAppointments = db.appointments.filter(a => a.userId === userId);

        // Adicionar informações da barbearia
        return userAppointments.map(appointment => {
            const barbershop = db.barbershops.find(b => b.id === appointment.barbershopId);
            return {
                ...appointment,
                barbershopName: barbershop ? barbershop.name : "Desconhecida",
                barbershopLocation: barbershop ? barbershop.location : ""
            };
        });
    }

    // Obter todos os agendamentos
    getAllAppointments() {
        const db = this.getDatabase();
        return db.appointments;
    }

    // Obter agendamentos por barbearia
    getAppointmentsByBarbershop(barbershopId) {
        const db = this.getDatabase();
        return db.appointments.filter(a => a.barbershopId === barbershopId);
    }

    // Obter agendamentos por data
    getAppointmentsByDate(date) {
        const db = this.getDatabase();
        return db.appointments.filter(a => a.date === date);
    }

    // Cancelar agendamento
    cancelAppointment(appointmentId) {
        const db = this.getDatabase();
        const appointment = db.appointments.find(a => a.id === appointmentId);

        if (!appointment) {
            return { success: false, message: "Agendamento não encontrado!" };
        }

        const currentUser = this.getCurrentUser();
        if (appointment.userId !== currentUser.userId) {
            return { success: false, message: "Você não tem permissão para cancelar este agendamento!" };
        }

        appointment.status = "cancelado";
        this.saveDatabase(db);

        return { success: true, message: "Agendamento cancelado com sucesso!" };
    }

    // Atualizar status do agendamento
    updateAppointmentStatus(appointmentId, status) {
        const db = this.getDatabase();
        const appointment = db.appointments.find(a => a.id === appointmentId);

        if (!appointment) {
            return { success: false, message: "Agendamento não encontrado!" };
        }

        const validStatuses = ["confirmado", "cancelado", "concluído"];
        if (!validStatuses.includes(status)) {
            return { success: false, message: "Status inválido!" };
        }

        appointment.status = status;
        this.saveDatabase(db);

        return { success: true, message: "Status atualizado com sucesso!" };
    }

    // Deletar agendamento
    deleteAppointment(appointmentId) {
        const db = this.getDatabase();
        const appointmentIndex = db.appointments.findIndex(a => a.id === appointmentId);

        if (appointmentIndex === -1) {
            return { success: false, message: "Agendamento não encontrado!" };
        }

        db.appointments.splice(appointmentIndex, 1);
        this.saveDatabase(db);

        return { success: true, message: "Agendamento removido com sucesso!" };
    }

    // ============================================
    // BARBEARIAS - CRUD
    // ============================================

    // Obter todas as barbearias
    getAllBarbershops() {
        const db = this.getDatabase();
        return db.barbershops;
    }

    // Obter barbearia por ID
    getBarbershopById(barbershopId) {
        const db = this.getDatabase();
        return db.barbershops.find(b => b.id === barbershopId);
    }

    // Buscar barbearias
    searchBarbershops(searchTerm) {
        const db = this.getDatabase();
        const term = searchTerm.toLowerCase();
        return db.barbershops.filter(b => 
            b.name.toLowerCase().includes(term) || 
            b.location.toLowerCase().includes(term)
        );
    }

    // Adicionar nova barbearia (admin)
    addBarbershop(barbershopData) {
        const db = this.getDatabase();
        
        const newBarbershop = {
            id: Date.now(),
            ...barbershopData,
            rating: 0,
            reviews: 0,
            createdAt: new Date().toISOString()
        };

        db.barbershops.push(newBarbershop);
        this.saveDatabase(db);

        return { success: true, message: "Barbearia cadastrada com sucesso!", barbershop: newBarbershop };
    }

    // Atualizar barbearia
    updateBarbershop(barbershopId, updateData) {
        const db = this.getDatabase();
        const barbershopIndex = db.barbershops.findIndex(b => b.id === barbershopId);

        if (barbershopIndex === -1) {
            return { success: false, message: "Barbearia não encontrada!" };
        }

        db.barbershops[barbershopIndex] = {
            ...db.barbershops[barbershopIndex],
            ...updateData
        };

        this.saveDatabase(db);
        return { success: true, message: "Barbearia atualizada com sucesso!" };
    }

    // ============================================
    // RELATÓRIOS E ESTATÍSTICAS
    // ============================================

    // Obter estatísticas do usuário
    getUserStats(userId) {
        const appointments = this.getUserAppointments(userId);
        
        return {
            total: appointments.length,
            confirmed: appointments.filter(a => a.status === "confirmado").length,
            completed: appointments.filter(a => a.status === "concluído").length,
            cancelled: appointments.filter(a => a.status === "cancelado").length,
            totalSpent: appointments
                .filter(a => a.status === "concluído")
                .reduce((sum, a) => sum + a.price, 0)
        };
    }

    // Obter próximos agendamentos do usuário
    getUpcomingAppointments(userId) {
        const appointments = this.getUserAppointments(userId);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return appointments
            .filter(a => {
                const appointmentDate = new Date(a.date);
                return appointmentDate >= today && a.status === "confirmado";
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    // Obter histórico de agendamentos
    getAppointmentHistory(userId) {
        const appointments = this.getUserAppointments(userId);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return appointments
            .filter(a => {
                const appointmentDate = new Date(a.date);
                return appointmentDate < today || a.status !== "confirmado";
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // ============================================
    // UTILIDADES
    // ============================================

    // Limpar banco de dados (CUIDADO!)
    clearDatabase() {
        localStorage.removeItem('barberDB');
        localStorage.removeItem('currentUser');
        this.initializeDatabase();
        return { success: true, message: "Banco de dados limpo!" };
    }

    // Exportar dados
    exportData() {
        return this.getDatabase();
    }

    // Importar dados
    importData(data) {
        try {
            localStorage.setItem('barberDB', JSON.stringify(data));
            return { success: true, message: "Dados importados com sucesso!" };
        } catch (error) {
            return { success: false, message: "Erro ao importar dados!" };
        }
    }

    // Gerar horários disponíveis para uma data
    getAvailableSlots(barbershopId, date) {
        const barbershop = this.getBarbershopById(barbershopId);
        if (!barbershop) return [];

        const { start, end, interval } = barbershop.workingHours;
        const slots = [];
        
        // Converter horários para minutos
        const [startHour, startMin] = start.split(':').map(Number);
        const [endHour, endMin] = end.split(':').map(Number);
        
        let currentMin = startHour * 60 + startMin;
        const endMin2 = endHour * 60 + endMin;

        while (currentMin < endMin2) {
            const hour = Math.floor(currentMin / 60);
            const min = currentMin % 60;
            const timeSlot = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
            
            const isAvailable = this.checkAvailability(barbershopId, date, timeSlot);
            
            slots.push({
                time: timeSlot,
                available: isAvailable
            });

            currentMin += interval;
        }

        return slots;
    }
}

// Criar instância global do banco de dados
const db = new BarberDatabase();

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.BarberDB = db;
}

// ============================================
// EXEMPLOS DE USO
// ============================================

/*

// CADASTRO DE USUÁRIO
const result = db.registerUser({
    name: "João Silva",
    email: "joao@email.com",
    password: "senha123",
    phone: "(11) 98765-4321",
    cpf: "123.456.789-00"
});
console.log(result);

// LOGIN
const loginResult = db.loginUser("joao@email.com", "senha123");
console.log(loginResult);

// VERIFICAR SE ESTÁ LOGADO
console.log(db.isLoggedIn());

// OBTER USUÁRIO ATUAL
console.log(db.getCurrentUser());

// CRIAR AGENDAMENTO
const appointment = db.createAppointment({
    barbershopId: 1,
    serviceId: 1,
    serviceName: "Corte Tradicional",
    date: "2024-02-10",
    time: "14:00",
    price: 45
});
console.log(appointment);

// OBTER AGENDAMENTOS DO USUÁRIO
const myAppointments = db.getUserAppointments(currentUserId);
console.log(myAppointments);

// CANCELAR AGENDAMENTO
const cancelResult = db.cancelAppointment(appointmentId);
console.log(cancelResult);

// OBTER ESTATÍSTICAS
const stats = db.getUserStats(currentUserId);
console.log(stats);

// OBTER BARBEARIAS
const barbershops = db.getAllBarbershops();
console.log(barbershops);

// BUSCAR BARBEARIAS
const searchResults = db.searchBarbershops("premium");
console.log(searchResults);

// HORÁRIOS DISPONÍVEIS
const slots = db.getAvailableSlots(1, "2024-02-10");
console.log(slots);

// LOGOUT
db.logoutUser();

*/