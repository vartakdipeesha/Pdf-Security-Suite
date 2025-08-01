                                                            
# Introduction

PDF Security Suite is a dual-function cybersecurity tool designed to both secure PDF files through encryption and exploit PDF vulnerabilities using ethical password-cracking techniques. This project provides a full-cycle simulation of both defence and offense.

It includes: 

•	PDF Protection Tool: Encrypts PDFs using AES-256 with user-defined passwords.<br>
•	PDF Cracker Tool: Uses dictionary-based and brute-force techniques to crack password-protected PDFs.<br>
•	A role-based dashboard and log visualizer, enhancing usability, visibility, and auditability.<br><br>
This project showcases offensive and defensive techniques through an intuitive Graphical User Interface (GUI) with role-based access (Admin/Viewer).

# Objectives

•	To simulate cloud security threats using offline PDF workflows.<br>
•	To encrypt and crack PDF files using strong and weak password logic.<br>
•	To implement smart brute-force and wordlist attacks with progress feedback.<br>
•	To provide a live dashboard showing logs and charts of cracking attempts.<br>
•	To demonstrate ethical hacking strategies using local file simulations.<br>

# Key Features

| Module	               |  Description                                                       
| ---------------------- | ----------------------------------------------------------------- |
| **Encryption**         |Secure any PDF using AES-256 encryption with a custom password.    |
| **PDF Cracking**       | Crack encrypted PDFs using smart dictionary attacks or brute-force methods.                       |
| **Brute-force Mode**   |  Custom character sets, length control, and multi-threaded attempts.        |
| **Wordlist Mode**      | Reads passwords from user-provided wordlist for fast testing.         |
| **Live Dashboard**     |   Shows cracking results, logs, recent activity, and pie charts.                   |
| **Role-based UI**      | Admins can encrypt, crack, and view all logs. Viewers can only view results.               |
                         
# Architecture Diagram

<img width="524" height="349" alt="image" src="https://github.com/user-attachments/assets/3cbff42e-127c-4d0a-91db-0db8c912d25f" /> 
 
# Tools & Libraries Used

|Tool/Library	          |        Purpose
------------------------|  -----------------------------------------------
|pikepdf	              |  PDF decryption/encryption using AES-256|
|tkinter	              |  GUI components |
|tqdm	                  |  Progress bars for cracking attempts|
|threading	            |  Multi-threaded brute-force engine|
|matplotlib	            |  Dashboard pie charts|
|os,time,json,datetime	|  Logging and file handling |


# Brute-Force Engine 
•	Character Set Selection: Lowercase, Uppercase, Digits, Symbols <br>
•	Length Control: Min & Max password length input by user <br>
•	Multithreaded: Tries multiple passwords simultaneously <br>
•	Smart Generator: Creates and tests combinations in real-time <br>


# Dashboard Preview

•	Pie Chart: Shows ratio of successful/failed attempts <br>
•	Logs Table: Shows PDF name, cracking time, method used <br>
•	Recent Files Section: View last 5 PDFs attempted <br>

•	Role-based UI:<br>
     o	Admins: Full access to tools & logs <br>
     o	Viewers: Read-only access to logs <br>

## Dashboard

<img width="452" height="250" alt="image" src="https://github.com/user-attachments/assets/010499ef-3b8b-445e-80f6-f2dbe009d157" />

<img width="452" height="250" alt="image" src="https://github.com/user-attachments/assets/74b052eb-d005-4dae-90e1-ac826ee8daf4" />

<img width="452" height="249" alt="image" src="https://github.com/user-attachments/assets/c6000949-c81a-497c-b4c2-6e5e49e65413" />

## Log

<img width="452" height="190" alt="image" src="https://github.com/user-attachments/assets/7ca53d0c-e262-4b0c-8266-e94911f07e54" />



## Encrpt

<img width="452" height="251" alt="image" src="https://github.com/user-attachments/assets/eddc35cf-9886-4316-a963-98cf58372130" />

<img width="452" height="250" alt="image" src="https://github.com/user-attachments/assets/b0c00034-636c-42cc-a55a-ca9d8abed31b" />

<img width="452" height="250" alt="image" src="https://github.com/user-attachments/assets/7e22efa4-2196-4f5b-9251-80f786ee1ccf" />

<img width="452" height="249" alt="image" src="https://github.com/user-attachments/assets/e42c0bc9-0859-415e-85f5-2e366b90f126" />

## Crack

<img width="452" height="251" alt="image" src="https://github.com/user-attachments/assets/d349a930-1b7c-48ce-8410-75045a0457c1" />

<img width="452" height="251" alt="image" src="https://github.com/user-attachments/assets/ddb74fbb-bf11-47da-a424-7872910e6145" />

<img width="452" height="250" alt="image" src="https://github.com/user-attachments/assets/02020457-9609-406f-9104-3abcb326a4e8" />

<img width="452" height="251" alt="image" src="https://github.com/user-attachments/assets/65b939f6-6110-41d5-be74-1b96d055a3ee" />

<img width="452" height="251" alt="image" src="https://github.com/user-attachments/assets/21e46e8c-2d8c-49aa-97da-d9922abaad18" />

<img width="452" height="245" alt="image" src="https://github.com/user-attachments/assets/7cf24d0d-fb79-497b-86be-7cd3b40e2684" />

<img width="452" height="228" alt="image" src="https://github.com/user-attachments/assets/d8193fbc-0f2d-459a-80d9-f280268a3ce7" />


## Role

<img width="452" height="251" alt="image" src="https://github.com/user-attachments/assets/801e9d0f-a0b0-456f-a217-3d6336410d71" />



# Final Reflections 

Working on the PDF Security Suite gave me practical exposure to both:<br>
•	Building defensive systems (through encryption and access roles)<br>
•	Performing ethical offensive simulations (through brute-force + wordlist cracking)<br>
<br>
*And taught me:*
<br>

•	Design and build GUI-based cybersecurity tools<br>
•	Create ethical hacking workflows with real-time feedback<br>
•	How to log and visualize security activity -a key requirement in audits<br><br>

This project is not just a demo ..it's a small, ethical simulation of real-world PDF threats, packed with features to learn and grow as a cybersecurity engineer.

