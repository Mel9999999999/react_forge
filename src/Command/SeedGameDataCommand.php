<?php

namespace App\Command;

use App\Entity\Character;
use App\Entity\GameGroup;
use Doctrine\ORM\EntityManagerInterface;
use Throwable;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\HttpKernel\KernelInterface;

#[AsCommand(name: 'app:seed-game-data', description: 'Seed characters and groups into SQL database')]
class SeedGameDataCommand extends Command
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly KernelInterface $kernel
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $path = $this->kernel->getProjectDir() . '/var/game_data.json';
        if (!is_file($path)) {
            $output->writeln('<error>Missing data file: var/game_data.json</error>');

            return Command::FAILURE;
        }

        $raw = file_get_contents($path);
        if ($raw === false) {
            $output->writeln('<error>Unable to read var/game_data.json</error>');

            return Command::FAILURE;
        }

        $data = json_decode($raw, true);
        if (!is_array($data)) {
            $output->writeln('<error>Invalid JSON in var/game_data.json</error>');

            return Command::FAILURE;
        }

        $connection = $this->entityManager->getConnection();
        $connection->executeStatement('DELETE FROM characters');
        $connection->executeStatement('DELETE FROM game_groups');
        try {
            $connection->executeStatement("DELETE FROM sqlite_sequence WHERE name IN ('characters', 'game_groups')");
        } catch (Throwable) {
            // Ignore when sqlite_sequence is unavailable (or non-SQLite platform).
        }

        foreach (($data['groups'] ?? []) as $groupData) {
            $group = (new GameGroup())
                ->setName((string) ($groupData['name'] ?? ''))
                ->setDescription((string) ($groupData['description'] ?? ''))
                ->setMaxMembers((int) ($groupData['maxMembers'] ?? 0))
                ->setAvailableSlots((int) ($groupData['availableSlots'] ?? 0))
                ->setMembers(array_values($groupData['members'] ?? []));

            $this->entityManager->persist($group);
        }

        foreach (($data['characters'] ?? []) as $characterData) {
            $character = (new Character())
                ->setName((string) ($characterData['name'] ?? ''))
                ->setClass((string) ($characterData['class'] ?? ''))
                ->setRace((string) ($characterData['race'] ?? ''))
                ->setLevel((int) ($characterData['level'] ?? 0))
                ->setAvatar((string) ($characterData['avatar'] ?? ''))
                ->setSkills(array_values($characterData['skills'] ?? []))
                ->setStats((array) ($characterData['stats'] ?? []))
                ->setGroups(array_values($characterData['groups'] ?? []));

            $this->entityManager->persist($character);
        }

        $this->entityManager->flush();

        $output->writeln('<info>Game data seeded in SQL database.</info>');

        return Command::SUCCESS;
    }
}
