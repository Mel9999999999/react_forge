<?php

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class ApiCorsSubscriber implements EventSubscriberInterface
{
    private const ALLOWED_ORIGINS = [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
    ];

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => 'onKernelRequest',
            KernelEvents::RESPONSE => 'onKernelResponse',
        ];
    }

    public function onKernelRequest(RequestEvent $event): void
    {
        $request = $event->getRequest();
        if (!str_starts_with($request->getPathInfo(), '/api')) {
            return;
        }

        if ($request->getMethod() !== 'OPTIONS') {
            return;
        }

        $response = new Response();
        $response->setStatusCode(Response::HTTP_NO_CONTENT);
        $this->applyHeaders($response, $request->headers->get('Origin'));
        $event->setResponse($response);
    }

    public function onKernelResponse(ResponseEvent $event): void
    {
        $request = $event->getRequest();
        if (!str_starts_with($request->getPathInfo(), '/api')) {
            return;
        }

        $this->applyHeaders($event->getResponse(), $request->headers->get('Origin'));
    }

    private function applyHeaders(Response $response, ?string $origin): void
    {
        $allowOrigin = in_array($origin, self::ALLOWED_ORIGINS, true)
            ? $origin
            : self::ALLOWED_ORIGINS[0];

        $response->headers->set('Access-Control-Allow-Origin', $allowOrigin);
        $response->headers->set('Vary', 'Origin');
        $response->headers->set('Access-Control-Allow-Methods', 'GET, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
}
