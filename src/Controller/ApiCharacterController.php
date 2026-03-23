<?php

namespace App\Controller;

use App\Entity\Character;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/characters')]
class ApiCharacterController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function list(EntityManagerInterface $entityManager): JsonResponse
    {
        $characters = $entityManager->getRepository(Character::class)->findAll();

        $payload = array_map([$this, 'serializeCharacter'], $characters);

        return $this->json($payload);
    }

    #[Route('/{id}', methods: ['GET'])]
    public function detail(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $character = $entityManager->getRepository(Character::class)->find($id);

        if (!$character) {
            return $this->json(['message' => 'Character not found'], 404);
        }

        return $this->json($this->serializeCharacter($character));
    }

    private function serializeCharacter(Character $character): array
    {
        return [
            'id' => $character->getId(),
            'name' => $character->getName(),
            'class' => $character->getClass(),
            'race' => $character->getRace(),
            'level' => $character->getLevel(),
            'avatar' => $character->getAvatar(),
            'skills' => $character->getSkills(),
            'stats' => $character->getStats(),
            'groups' => $character->getGroups(),
        ];
    }
}
