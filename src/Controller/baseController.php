<?php

// src/Controller/LuckyController.php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
class baseController extends AbstractController
{
    #[Route('/')]
    public function base(): Response
    {
        return $this->render('accueil.html.twig');
    }
    #[Route('/films')]
    public function film(): Response
    {
        return $this->render('film.html.twig');
    }
    #[Route('/contact')]
    public function contact(): Response
    {
        return $this->render('contact.html.twig');
    }
}
