
      document.addEventListener('DOMContentLoaded', function() {
    const btnEdad1 = document.getElementById('btnEdad1');
    const btnEdad2 = document.getElementById('btnEdad2');
    const btnEdad3 = document.getElementById('btnEdad3');
    const btnEdad4 = document.getElementById('btnEdad4');
    const btnEdad5 = document.getElementById('btnEdad5');
    const btnEdad6 = document.getElementById('btnEdad6');
    const seccionEdad1 = document.getElementById('seccionEdad1');
    const seccionEdad2 = document.getElementById('seccionEdad2');
    const seccionEdad3 = document.getElementById('seccionEdad3');
    const seccionEdad4 = document.getElementById('seccionEdad4');
    const seccionEdad5 = document.getElementById('seccionEdad5');
    const seccionEdad6 = document.getElementById('seccionEdad6');
    const hitosDesarrollo = document.querySelectorAll('.hitosDesarrollo');

    // Función para mostrar la sección de la Edad 1
    btnEdad1.addEventListener('click', function() {
        seccionEdad1.style.display = 'block';
        seccionEdad2.style.display = 'none';
        seccionEdad3.style.display = 'none';
        seccionEdad4.style.display = 'none';
        seccionEdad5.style.display = 'none';
        seccionEdad6.style.display = 'none';
        hitosDesarrollo.forEach(hito => hito.style.display = 'none');
    });

    // Función para mostrar la sección de la Edad 2
    btnEdad2.addEventListener('click', function() {
        seccionEdad2.style.display = 'block';
        seccionEdad1.style.display = 'none';
        seccionEdad3.style.display = 'none';
        seccionEdad4.style.display = 'none';
        seccionEdad5.style.display = 'none';
        seccionEdad6.style.display = 'none';
        hitosDesarrollo.forEach(hito => hito.style.display = 'none');
    });

    // Función para mostrar la sección de la Edad 3
    btnEdad3.addEventListener('click', function() {
        seccionEdad3.style.display = 'block';
        seccionEdad1.style.display = 'none';
        seccionEdad2.style.display = 'none';
        seccionEdad4.style.display = 'none';
        seccionEdad5.style.display = 'none';
        seccionEdad6.style.display = 'none';
        hitosDesarrollo.forEach(hito => hito.style.display = 'none');
    });

    // Función para mostrar la sección de la Edad 4
    btnEdad4.addEventListener('click', function() {
        seccionEdad4.style.display = 'block';
        seccionEdad1.style.display = 'none';
        seccionEdad2.style.display = 'none';
        seccionEdad3.style.display = 'none';
        seccionEdad5.style.display = 'none';
        seccionEdad6.style.display = 'none';
        hitosDesarrollo.forEach(hito => hito.style.display = 'none');
    });

    // Función para mostrar la sección de la Edad 5
    btnEdad5.addEventListener('click', function() {
        seccionEdad5.style.display = 'block';
        seccionEdad1.style.display = 'none';
        seccionEdad2.style.display = 'none';
        seccionEdad3.style.display = 'none';
        seccionEdad4.style.display = 'none';
        seccionEdad6.style.display = 'none';
        hitosDesarrollo.forEach(hito => hito.style.display = 'none');
    });

    // Función para mostrar la sección de la Edad 6
    btnEdad6.addEventListener('click', function() {
        seccionEdad6.style.display = 'block';
        seccionEdad1.style.display = 'none';
        seccionEdad2.style.display = 'none';
        seccionEdad3.style.display = 'none';
        seccionEdad4.style.display = 'none';
        seccionEdad5.style.display = 'none';
        hitosDesarrollo.forEach(hito => hito.style.display = 'none');
    });

    // Configuración inicial de las gráficas usando Chart.js
    const charts = {};
    const ctxPromedio = document.getElementById('chartPromedioDesarrollos').getContext('2d');

    function setupChart(ctx, desarrolloId) {
        return new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Completado', 'Pendiente'],
                datasets: [{
                    data: [0, 100],
                    backgroundColor: ['#4caf50', '#f44336']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed) {
                                    label += context.parsed + '%';
                                }
                                return label;
                            }
                        }
                    },
                    legend: false,
                    doughnutLabel: {
                        labels: [{
                            text: function(context) {
                                let label = context.chart.data.datasets[0].data[0] + '%';
                                return label;
                            },
                            color: '#000000',
                            font: {
                                size: '16'
                            }
                        }]
                    }
                }
            }
        });
    }

    // Configuración de todas las gráficas individuales
    ['desarrollo1', 'desarrollo2', 'desarrollo3', 'desarrollo4', 'desarrollo5'].forEach(function(desarrolloId, index) {
        const chartCtx = document.getElementById(`chartDesarrollo${index + 1}`).getContext('2d');
        charts[desarrolloId] = setupChart(chartCtx, desarrolloId);
    });

    // Configuración de la gráfica de promedio
    charts['promedio'] = new Chart(ctxPromedio, {
        type: 'doughnut',
        data: {
            labels: ['Completado', 'Pendiente'],
            datasets: [{
                data: [0, 100],
                backgroundColor: ['#4caf50', '#f44336']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed) {
                                label += context.parsed + '%';
                            }
                            return label;
                        }
                    }
                },
                legend: false,
                doughnutLabel: {
                    labels: [{
                        text: function(context) {
                            let label = context.chart.data.datasets[0].data[0] + '%';
                            return label;
                        },
                        color: '#000000',
                        font: {
                            size: '16'
                        }
                    }]
                }
            }
        }
    });

    // Funciones para los botones de desarrollo
    ['1', '2', '3', '4', '5'].forEach(function(numero) {
        document.querySelectorAll(`.btnDesarrollo${numero}`).forEach(function(btn) {
            btn.addEventListener('click', function() {
                // Ocultar todos los hitos
                hitosDesarrollo.forEach(hito => hito.style.display = 'none');
                // Mostrar solo los hitos correspondientes al desarrollo seleccionado
                document.querySelector(`.hitosDesarrollo${numero}`).style.display = 'block';
            });
        });
    });

    // Función para actualizar una gráfica específica
    function updateChart(chart, completedTasks) {
        chart.data.datasets[0].data[0] = (completedTasks / 10) * 100;
        chart.data.datasets[0].data[1] = 100 - chart.data.datasets[0].data[0];
        chart.update();
    }

    // Función para actualizar la gráfica de promedio de desarrollos
    function updatePromedioChart() {
        const totalCompleted = document.querySelectorAll('.btn-check:checked').length;
        const totalTasks = 50; // 10 hitos por cada 5 desarrollos
        charts['promedio'].data.datasets[0].data[0] = (totalCompleted / totalTasks) * 100;
        charts['promedio'].data.datasets[0].data[1] = 100 - charts['promedio'].data.datasets[0].data[0];
        charts['promedio'].update();
    }

    // Escuchar cambios en los checkboxes para actualizar las gráficas
    document.querySelectorAll('.btn-check').forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            const desarrolloId = this.name.split('-')[1];
            const completedTasks = document.querySelectorAll(`input[name="${this.name}"]:checked`).length;
            const label = document.querySelector(`label[for="${this.id}"]`);

            if (this.checked) {
                label.textContent = 'Completado';
            } else {
                label.textContent = 'Completar';
            }

            updateChart(charts[desarrolloId], completedTasks);
            updatePromedioChart();
        });
    });
});

