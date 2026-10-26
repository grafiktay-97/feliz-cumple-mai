// ✦ Programa del Primer Acto ✦
// Cada línea es un número del show, en el orden en que aparece.
//   src:    ruta del archivo
//   marco:  true si la imagen ya trae su marco (carpeta img/marcos)
//   preset: 1 a 4, marco "Marco Preset" para fotos y videos sueltos
//   tipo:   "foto" o "video" (se detecta por la extensión si se omite)
//   acto:   disciplina circense que se muestra en la placa
//   titulo: nombre del número
//   nota:   texto del programa, se lee en el visor

window.OBRAS = [
  { src: "img/marcos/marco-12.png", marco: true, acto: "Equilibrio", titulo: "La sirena del acantilado", nota: "Sin red y sin protector solar. Número de alto riesgo frente al mar." },
  { src: "img/fotos/wa-2-05-21-pm.jpg", preset: 4, acto: "Variété", titulo: "Dúo panorámico", nota: "Dos artistas, un río y el mejor ángulo de la gira." },
  { src: "img/marcos/marco-02.png", marco: true, acto: "Doma", titulo: "La domadora de felinos", nota: "La fiera aceptó la foto. Aplausos para ambas." },
  { src: "img/videos/baile-tunel.mp4", preset: 3, acto: "Danza", titulo: "Baile en el túnel", nota: "Primer número de la noche: la artista calienta motores." },
  { src: "img/marcos/marco-11.png", marco: true, acto: "Aero", titulo: "Aprender a volar", nota: "Lema oficial de la compañía." },
  { src: "img/fotos/cap-141903.jpg", preset: 2, acto: "Acrobacia", titulo: "Salto mortal al sol", nota: "Contraluz, piruetas y cero miedo." },
  { src: "img/marcos/marco-04.png", marco: true, acto: "Variété", titulo: "Dúo de variedades", nota: "Galería de arte, vestuario de gira." },
  { src: "img/fotos/wa-2-05-23-pm-1.jpg", preset: 1, acto: "Troupe", titulo: "Cuarteto del río", nota: "Selfie grupal: la acrobacia más difícil del repertorio." },
  { src: "img/marcos/marco-07.png", marco: true, acto: "Acrobacia", titulo: "Acrobacia grupal", nota: "Brazos arriba, todas a la vez. Ensayado cero veces." },
  { src: "img/fotos/cap-142513.jpg", preset: 4, acto: "Payasos", titulo: "Manifiesto del payaso", nota: "La locura no existe. Lo dice el cartel." },
  { src: "img/marcos/marco-01.png", marco: true, acto: "Equilibrio", titulo: "Las equilibristas del malbec", nota: "Copa en mano, sin derramar una gota." },
  { src: "img/fotos/wa-2-05-24-pm-1.jpg", preset: 3, acto: "Malabares", titulo: "Brindis de altura", nota: "Malabares con botellas entre las viñas." },
  { src: "img/marcos/marco-10.png", marco: true, acto: "Doma", titulo: "La fiera mansa", nota: "Retrato oficial de la estrella de cuatro patas." },
  { src: "img/videos/fiera-domada.mp4", preset: 1, acto: "Doma", titulo: "La fiera domada", nota: "Número en vivo: caricias sin látigo." },
  { src: "img/marcos/marco-03.png", marco: true, acto: "Aventura", titulo: "La exploradora de cumbres", nota: "Gorro, lentes y la montaña de escenografía." },
  { src: "img/fotos/wa-2-05-32-pm-1.jpg", preset: 3, acto: "Contorsión", titulo: "Pose de contorsionista", nota: "Pierna arriba, sonrisa intacta." },
  { src: "img/marcos/marco-05.png", marco: true, acto: "Intermedio", titulo: "Acto de calma", nota: "Hasta las artistas necesitan un intervalo junto al lago." },
  { src: "img/fotos/wa-2-05-24-pm-2.jpg", preset: 2, acto: "Troupe", titulo: "La compañía completa", nota: "Elenco estable, temporada de vendimia." },
  { src: "img/marcos/marco-06.png", marco: true, acto: "Variété", titulo: "El gran banquete", nota: "Detrás de escena: picada, risas y sobremesa." },
  { src: "img/fotos/wa-2-05-22-pm-2.jpg", preset: 1, acto: "Malabares", titulo: "Malabares de cocina", nota: "Platos en el aire, todo bajo control." },
  { src: "img/marcos/marco-08.png", marco: true, acto: "Troupe", titulo: "La troupe del verano", nota: "Función al aire libre, entrada libre y gratuita." },
  { src: "img/marcos/marco-09.png", marco: true, acto: "Nocturno", titulo: "Función nocturna", nota: "La gira sigue cuando se apagan las luces." },
  { src: "img/fotos/wa-2-05-31-pm.jpg", preset: 4, acto: "Equilibrio", titulo: "La equilibrista solitaria", nota: "Muros altos, artista pequeña, presencia enorme." },
  { src: "img/fotos/wa-2-05-32-pm.jpg", preset: 2, acto: "Variété", titulo: "Las del barril", nota: "Dúo cómico con escenografía de bodega." },
  { src: "img/fotos/wa-2-05-22-pm-1.jpg", preset: 3, acto: "Intermedio", titulo: "Pausa entre funciones", nota: "Sombra, árbol y descanso de las artistas." },
  { src: "img/fotos/wa-2-05-31-pm-2.jpg", preset: 1, acto: "Variété", titulo: "Dúo de variedades, segunda función", nota: "Por pedido del público, se repite el número." },
  { src: "img/fotos/cap-142521.jpg", preset: 4, acto: "Final", titulo: "Regreso a la carpa", nota: "Porque después de cada gira, no hay mejor lugar que casa." },
];
