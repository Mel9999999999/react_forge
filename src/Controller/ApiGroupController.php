<?php

namespace App\Controller;

use App\Entity\GameGroup;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/groups')]
class ApiGroupController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function list(EntityManagerInterface $entityManager): JsonResponse
    {
        $groups = $entityManager->getRepository(GameGroup::class)->findAll();

        $payload = array_map([$this, 'serializeGroup'], $groups);

        return $this->json($payload);
    }

    #[Route('/{id}', methods: ['GET'])]
    public function detail(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $group = $entityManager->getRepository(GameGroup::class)->find($id);

        if (!$group) {
            return $this->json(['message' => 'Group not found'], 404);
        }

        return $this->json($this->serializeGroup($group));
    }

    private function serializeGroup(GameGroup $group): array
    {
        return [
            'id' => $group->getId(),
            'name' => $group->getName(),
            'description' => $group->getDescription(),
            'maxMembers' => $group->getMaxMembers(),
            'availableSlots' => $group->getAvailableSlots(),
            'members' => $group->getMembers(),
        ];
    }
}
