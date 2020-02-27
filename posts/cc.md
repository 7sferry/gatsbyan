---
title: 'JavaScript Regular Expressions and the Test() Method'
tags: ["javascript"]
published: true
featuredImage: './spl.jpg'
date: '2019-01-06'
---

![image](./spl.jpg)
Untuk mendapatkannya bisa download langsung dari situs resminya <a href="https://mirillis.com/free-hd-video-player" rel="nofollow" target="_blank">disini</a>. Tinggal dibuka dan install kayak biasa, dan langsung bisa dipakai. Tapi untuk merasakan fitur HD, harus dilakukan beberapa set-up dulu, kalau nggak, ya ga berasa, malah keliatan sama aja kayak video player lainnya.<br />
<br />
Secara default video player ini dijalankan dengan VGA onboard semacam Intel gitu. Pakai Intel onboard juga udah bagus kok, tapi kalau punya NVIDIA alangkah baiknya dimaksimalkan kekuatan VGA-nya daripada nganggur. Bagi yang VGA nya Intel abaikan saja step ini dan lanjut bagian penyetingan Splash. Bagi yang AMD juga abaikan karena gw belum pernah nyetting ini pakai AMD. Bagi yang NVIDIA, silakan dibuka NVIDIA Control Panel dan pilih manage 3D setting. Pada panel kanan pilih Program Setting dan klik tombol add seperti pada gambar.<br />
<table align="center" cellpadding="0" cellspacing="0" class="tr-caption-container" style="margin-left: auto; margin-right: auto; text-align: center;"><tbody>
<tr><td style="text-align: center;"><a href="https://1.bp.blogspot.com/-V218wVjg3rk/XiRmMwKjaAI/AAAAAAAACHI/5yYJnYaXvBoyVUXfeLmUVrfjC2xslHH2wCLcBGAsYHQ/s1600/nvidia.jpg" imageanchor="1" style="margin-left: auto; margin-right: auto;"><img border="0" data-original-height="711" data-original-width="958" height="237" src="https://1.bp.blogspot.com/-V218wVjg3rk/XiRmMwKjaAI/AAAAAAAACHI/5yYJnYaXvBoyVUXfeLmUVrfjC2xslHH2wCLcBGAsYHQ/s320/nvidia.jpg" width="320" /></a></td></tr>
<tr><td class="tr-caption" style="text-align: center;">Nvidia Tutorial</td></tr>
</tbody></table>
<br />
Jika pernah membuka Splash sebelumnya biasanya udah ada Splash pada list yang muncul. Kalau ga ada tinggal klik tombol browse aja dan masuk ke folder tempat penginstalan Splash, defaultnya di C:/Program Files (x86)/mirillis/splash dan pilih file splash.exe. Lalu pilih tombol "Add Selected Programs".<br />
<table align="center" cellpadding="0" cellspacing="0" class="tr-caption-container" style="margin-left: auto; margin-right: auto; text-align: center;"><tbody>
<tr><td style="text-align: center;"><a href="https://1.bp.blogspot.com/-rw0DXhjwcqM/XiRny6eI4TI/AAAAAAAACHY/jKE1XDg1ED8pum67pivR0G_oSqPLmE5HgCLcBGAsYHQ/s1600/nvidia%2Badd.jpg" imageanchor="1" style="margin-left: auto; margin-right: auto;"><img border="0" data-original-height="854" data-original-width="969" height="282" src="https://1.bp.blogspot.com/-rw0DXhjwcqM/XiRny6eI4TI/AAAAAAAACHY/jKE1XDg1ED8pum67pivR0G_oSqPLmE5HgCLcBGAsYHQ/s320/nvidia%2Badd.jpg" width="320" /></a></td></tr>
<tr><td class="tr-caption" style="text-align: center;">Tambahkan Splash ke NVIDIA</td></tr>
</tbody></table>
<br />
Lalu pilih High-performance NVIDIA processor seperti pada gambar dan tutup NVIDIA Control Panel-nya. <br />
<table align="center" cellpadding="0" cellspacing="0" class="tr-caption-container" style="margin-left: auto; margin-right: auto; text-align: center;"><tbody>
<tr><td style="text-align: center;"><a href="https://1.bp.blogspot.com/-HSSTFn2jfqU/XiRoe5R6RxI/AAAAAAAACHw/aHcA1LcHwjsdJqA_GKxMraepLREfOLhKgCLcBGAsYHQ/s1600/nvidia%2Blast.jpg" imageanchor="1" style="margin-left: auto; margin-right: auto;"><img border="0" data-original-height="712" data-original-width="962" height="236" src="https://1.bp.blogspot.com/-HSSTFn2jfqU/XiRoe5R6RxI/AAAAAAAACHw/aHcA1LcHwjsdJqA_GKxMraepLREfOLhKgCLcBGAsYHQ/s320/nvidia%2Blast.jpg" width="320" /></a></td></tr>
<tr><td class="tr-caption" style="text-align: center;">Pilih NVIDIA</td></tr>
</tbody></table>
<br />
Sekarang secara default Splash akan menggunakan NVIDIA sebagai VGA utama. Kalau langkah-langkah di atas dilakukan dengan benar, maka settingan Video pada Splash akan mendeteksi NVIDIA PureVideo. Lanjut ke penyetingan Splash. <br />
<br />
Untuk melakukan penyetingannya cukup buka aplikasinya dan arahkan kursor ke atas dan klik Setting. Untuk tab general gw standar aja sih, soalnya ga terlalu penting juga 😅.<br />
<table align="center" cellpadding="0" cellspacing="0" class="tr-caption-container" style="margin-left: auto; margin-right: auto; text-align: center;"><tbody>
<tr><td style="text-align: center;"><a href="https://1.bp.blogspot.com/-qxDWG-BURd8/XiRW49_SOhI/AAAAAAAACFs/D5FDzIBPcBo6QXRP0tpGULn3J6kcTBSNgCLcBGAsYHQ/s1600/general.jpg" imageanchor="1" style="margin-left: auto; margin-right: auto;"><img border="0" data-original-height="586" data-original-width="959" height="195" src="https://1.bp.blogspot.com/-qxDWG-BURd8/XiRW49_SOhI/AAAAAAAACFs/D5FDzIBPcBo6QXRP0tpGULn3J6kcTBSNgCLcBGAsYHQ/s320/general.jpg" width="320" /></a></td></tr>
<tr><td class="tr-caption" style="text-align: center;">General Setting</td></tr>
</tbody></table>
Selanjutnya di tab Video, ini settingan yang paling penting dan sangat berpengaruh terhadap kualitas videonya. Bagi yang memakai VGA NVIDIA pada kotak hardware acceleration, pastikan muncul opsi NVIDIA PureVideo, jika tidak pastikan lagi aplikasinya dibuka menggunakan NVIDIA. Selain NVIDIA juga ada pilihannya kok seperti Intel dan AMD. Pastikan aja kotak tersebut tercentang. Settingan lainnya tinggal disesuaikan aja. Kalau gw settingannya kayak gini aja. <br />
<table align="center" cellpadding="0" cellspacing="0" class="tr-caption-container" style="margin-left: auto; margin-right: auto; text-align: center;"><tbody>
<tr><td style="text-align: center;"><a href="https://1.bp.blogspot.com/-DJjYb-ar8io/XiRZMQV7lfI/AAAAAAAACGI/eZtFMusULPUgXdaiBAWIGuBS4Qla7IBMACLcBGAsYHQ/s1600/video.jpg" imageanchor="1" style="margin-left: auto; margin-right: auto;"><img border="0" data-original-height="587" data-original-width="960" height="195" src="https://1.bp.blogspot.com/-DJjYb-ar8io/XiRZMQV7lfI/AAAAAAAACGI/eZtFMusULPUgXdaiBAWIGuBS4Qla7IBMACLcBGAsYHQ/s320/video.jpg" width="320" /></a></td></tr>
<tr><td class="tr-caption" style="text-align: center;">Video Setting</td></tr>
</tbody></table>
<br />
Untuk tab Audio, sesuaikan aja dengan kondisi perangkat masing-masing, berhubung laptop gw ga support 5.1 dan lainnya, jadi gw pilihnya Stereo Surround aja. Bagi yang ga tahu perangkatnya support apa aja, pilih Stereo Surround aja daripada ribet sendiri 😅.<br />
<table align="center" cellpadding="0" cellspacing="0" class="tr-caption-container" style="margin-left: auto; margin-right: auto; text-align: center;"><tbody>
<tr><td style="text-align: center;"><a href="https://1.bp.blogspot.com/-eWCltMuTeQA/XiRahy8OUrI/AAAAAAAACGU/FbXIpzmRur8pLOIP8a5D3gp_5Ktf11qygCLcBGAsYHQ/s1600/audio%2Bs.jpg" imageanchor="1" style="margin-left: auto; margin-right: auto;"><img border="0" data-original-height="588" data-original-width="960" height="196" src="https://1.bp.blogspot.com/-eWCltMuTeQA/XiRahy8OUrI/AAAAAAAACGU/FbXIpzmRur8pLOIP8a5D3gp_5Ktf11qygCLcBGAsYHQ/s320/audio%2Bs.jpg" width="320" /></a></td></tr>
<tr><td class="tr-caption" style="text-align: center;">Audio Setting</td></tr>
</tbody></table>
<br />
<br />
Tab selanjutnya Subtitle. Ini juga penting bagi yang suka nonton film luar, apalagi kalau ga ngerti bahasanya kayak film Korea, Jepang, India, Thailand. Secara default Splash tidak me-load otomatis subtitle yang memiliki nama sama dengan nama file video. Untuk itu opsinya perlu kita centang disini. <br />
<table align="center" cellpadding="0" cellspacing="0" class="tr-caption-container" style="margin-left: auto; margin-right: auto; text-align: center;"><tbody>
<tr><td style="text-align: center;"><a href="https://1.bp.blogspot.com/-WeG9lZ53wGQ/XiRbYRYsthI/AAAAAAAACGs/nZskqzjfy5gOOJe4JUIzDeCg_WoVBuSaACLcBGAsYHQ/s1600/Sub.jpg" imageanchor="1" style="margin-left: auto; margin-right: auto;"><img border="0" data-original-height="589" data-original-width="962" height="195" src="https://1.bp.blogspot.com/-WeG9lZ53wGQ/XiRbYRYsthI/AAAAAAAACGs/nZskqzjfy5gOOJe4JUIzDeCg_WoVBuSaACLcBGAsYHQ/s320/Sub.jpg" width="320" /></a></td></tr>
<tr><td class="tr-caption" style="text-align: center;">Subtitle Setting</td></tr>
</tbody></table>
<br />
Tab selanjutnya ga usah dibahas, karena Export itu untuk mengkonversi video. Sedangkan fokus gw disini untuk menonton video aja. Bagi yang mau explore sendiri silakan.<br />
<br />
Selanjutnya menyetel playback-nya untuk memaksimalkan VGA yang udah kita set tadi. Kita bisa menyetel tingkat kualitasnya melalui Playback Options, mulai dari motion, detail, dan warnanya. Untuk membuka settingannya tinggal pencet tombol 'O' pada keyboard. Kalau gw sih rata kanan aja 🤩. <br />
<table align="center" cellpadding="0" cellspacing="0" class="tr-caption-container" style="margin-left: auto; margin-right: auto; text-align: center;"><tbody>
<tr><td style="text-align: center;"><a href="https://1.bp.blogspot.com/-p5EI4mBDGSw/XiRTl19SVhI/AAAAAAAACE0/XP8MD85Spxoq1G22na5eC2jdkwEv8wTlACEwYBhgL/s1600/setting.jpg" imageanchor="1" style="margin-left: auto; margin-right: auto;"><img border="0" data-original-height="599" data-original-width="962" height="199" src="https://1.bp.blogspot.com/-p5EI4mBDGSw/XiRTl19SVhI/AAAAAAAACE0/XP8MD85Spxoq1G22na5eC2jdkwEv8wTlACEwYBhgL/s320/setting.jpg" width="320" /></a></td></tr>
<tr><td class="tr-caption" style="text-align: center;">Setting Playback Options</td></tr>
</tbody></table>
<span id="goog_299415945"></span><span id="goog_299415946"></span><br />
Selain video, audio playback-nya juga bisa diatur jika seandainya suara yang dihasilkan terlalu kecil. Kalau buat gw sih segini aja cukup, kalau kegedean ntar suaranya pecah, tergantung dari kualitas audionya juga sih.<br />
<table align="center" cellpadding="0" cellspacing="0" class="tr-caption-container" style="margin-left: auto; margin-right: auto; text-align: center;"><tbody>
<tr><td style="text-align: center;"><a href="https://1.bp.blogspot.com/-gzeTYGwBEu4/XiRUkQx862I/AAAAAAAACFQ/XGvOnBkmf3MBocMFeNoRpRptukFvTTa8QCLcBGAsYHQ/s1600/Audio.jpg" imageanchor="1" style="margin-left: auto; margin-right: auto;"><img border="0" data-original-height="586" data-original-width="956" height="196" src="https://1.bp.blogspot.com/-gzeTYGwBEu4/XiRUkQx862I/AAAAAAAACFQ/XGvOnBkmf3MBocMFeNoRpRptukFvTTa8QCLcBGAsYHQ/s320/Audio.jpg" width="320" /></a></td></tr>
<tr><td class="tr-caption" style="text-align: center;">Setting Audio Playback Options</td></tr>
</tbody></table>
<br />
Setelah menyetel semuanya, tutup dulu aplikasinya, baru dibuka lagi untuk melihat perubahannya. Silakan lakukan test untuk melihat perubahannya. Dianjurkan untuk memutar film kualitas Wedb-DL ke atas untuk menikmati fiturnya dengan nyaman. Selain itu fiturnya juga ada semisal screenshot frame, export video, 3D subtitle, dll. Tapi ga gw bahas, bagi yang mau explore sendiri silakan aja. <br />
<br />
Software itu ga ada yang sempurna. Daritadi kan bahas kelebihannya aja, sekarang kita bahas kelemahannya. Ada beberapa kelemahan yang menurut gw cukup mengganggu di aplikasi ini.<br />
<br />
Pertama, softwarenya ga mendukung banyak codec(Format Video Type). Ga seperti Media Player Classic yang punya K-Lite Codec Pack yang membuatnya support hampir segala macam format Video, Splash justru hanya support beberapa format video saja. Tapi tenang aja, mayoritas film bluRay dan Web-DL itu Video Type nya H.264/AVC yang udah full support sama Splash ini. Makanya biar aman, putar video yang udah bluRay atau minimal Web-DL aja.<br />
<br />
Kelemahan kedua terletak pada subtitle. Splash tidak support dengan subtitle berwarna, jadi kalau punya subtitle yang ada warnanya subtitle-nya harus di-edit dulu dan buang format &lt;font&gt; dan &lt;/font&gt; pada subtitle menggunakan notepad. Atau kalau mau gampang, download subtitle yang ga ada warnanya aja. Kalau bosen dengan subtitle warna putih tinggal ubah aja di Settingan Subtitle, ga cuma ganti warna, ganti font juga bisa kok. Selain itu Splash cuma optimal dengan subtitle berformat .srt. Sisanya kadang lancar kadang nggak. Tapi tenang aja, di subscene.com mayoritas subtitle formatnya .srt kok.<br />
<br />
Yang ketiga soal kualitas videonya. Seperti yang gw mention di atas, Splash cuma mampu maksimal untuk video bluRay atau minimal Web-DL agar bisa menikmati fiturnya dengan nyaman. Jadi kalau kualitas videonya DVDRip kebawah apalagi HD Cam, ya ga terlalu ngaruh hasilnya. Sebenarnya ini bukan kelemahan juga sih, karena pakai video player lainnya juga sama aja, memang yang namanya DVDRip kebawah itu bikin sakit mata 😂.<br />
<br />
Terakhir, soal settingannya. Kalau menurut gw ini juga bukan kelemahan sih, karena gw orangnya emang suka explore aplikasi. Tapi bagi orang awam nyetel-nyetel settingan kayak di atas cukup ribet. Secara default tanpa di-setting Splash ini sama aja kayak video player lainnya, terasa kualitasnya hanya ketika semua settingannya sudah disetel. Jadi orang awam yang mau menikmati Splash ini ya wajib setel-setel dulu. Makanya gw share tutorial begini 😊.<br />
<br />
Kalau ada yang mau ditanyakan silakan tanya-tanya aja. 😎<br />
<span class="fullpost">


</span>
