import { WorkflowGraph } from '@/lib/workflow/types';

export const simpleWorkflow: WorkflowGraph = {
    nodes: [
        {
            id: 'start-node',
            kind: 'core:triggers:manual',
            version: '1.0.0',
            name: 'Start'
        },
        {
            id: 'process-node',
            kind: 'core:process',
            version: '1.0.0',
            name: 'Process'
        },
        {
            id: 'decision-node',
            kind: 'core:decision',
            version: '1.0.0',
            name: 'Decision'
        },
        {
            id: 'success-node',
            kind: 'core:success',
            version: '1.0.0',
            name: 'Success'
        },
        {
            id: 'failure-node',
            kind: 'core:failure',
            version: '1.0.0',
            name: 'Failure'
        }
    ],
    edges: {
        Start: {
            main: [
                {
                    node: 'Process',
                    port: 'main',
                    order: 0
                }
            ]
        },
        Process: {
            main: [
                {
                    node: 'Decision',
                    port: 'main',
                    order: 0
                }
            ]
        },
        Decision: {
            success: [
                {
                    node: 'Success',
                    port: 'main',
                    order: 0
                }
            ],
            failure: [
                {
                    node: 'Failure',
                    port: 'main',
                    order: 0
                }
            ]
        }
    }
};

export const complexWorkflow: WorkflowGraph = {
    nodes: [
        {
            id: 'cca820ee-0d8e-4220-8ffd-41e49e094660',
            kind: 'core:triggers:manual',
            version: '1.0.0',
            name: 'Manual'
        },
        {
            id: 'eaae0678-09e7-4042-aa90-c5635f3a2625',
            kind: 'core:http_request',
            version: '4.2.0',
            name: 'Get Table of Contents'
        },
        {
            id: '99996bc0-809d-422d-bc1a-2868bd7e55fb',
            kind: 'core:split_input',
            version: '1.0.0',
            name: 'Split Out Items'
        },
        {
            id: 'b3408535-9f25-401e-9afd-843c9b200cde',
            kind: 'core:filter',
            version: '2.2.0',
            name: 'Keep HTTP Services Only'
        },
        {
            id: '50abc6d6-ee14-4721-9dc1-06d25434cd4c',
            kind: 'core:code',
            version: '2.0.0',
            name: 'Map Operations'
        },
        {
            id: '20b98b6a-143c-468c-9e51-f2d6fd9deb52',
            kind: 'core:switch',
            version: '3.2.0',
            name: 'Filter Operations With Errors'
        },
        {
            id: '95e01fe1-7ff6-43cf-9790-eed0990d69ac',
            kind: 'core:no_op',
            version: '1.0.0',
            name: 'Mapped Services'
        },
        {
            id: '5193bab9-d7ee-40b0-b13e-9c84e187d63c',
            kind: 'core:set',
            version: '3.4.0',
            name: 'Services'
        },
        {
            id: '57c44dad-398b-42f2-873a-48eebd4e3019',
            kind: 'core:no_op',
            version: '1.0.0',
            name: 'Services With Errors'
        },
        {
            id: '40e404ff-e576-4472-bf07-e49d5ea2825f',
            kind: 'core:http_request',
            version: '4.2.0',
            name: 'Get Service Nodes'
        },
        {
            kind: 'core:http_request',
            version: '4.2.0',
            id: 'a139a82b-fd25-42e4-8efe-24aedd5efa89',
            name: 'Get Bundled Spec'
        },
        {
            id: 'e3d784b5-96d7-4756-9d5b-d01d16c064fc',
            kind: 'noco_db:action',
            version: '3.0.0',
            name: 'Latest Known Spec'
        },
        {
            id: 'be3523bc-fdc6-442b-8c86-538ccab6504b',
            kind: 'noco_db:action',
            version: '3.0.0',
            name: 'NocoDB'
        },
        {
            id: '7f04e2aa-86cc-4b82-a5b5-3d3c76b5e351',
            kind: 'core:if',
            version: '2.2.0',
            name: 'Is Known Service?'
        },
        {
            id: 'ad394f1f-d312-4167-bb1e-07df18b3738d',
            kind: 'core:code',
            version: '2.0.0',
            name: 'Match Found, Check For Changes'
        },
        {
            id: '810ee533-d784-4b66-9d38-82321728b3be',
            kind: 'core:switch',
            version: '3.2.0',
            name: 'Has Changes?'
        },
        {
            id: '53dc9809-be9a-4686-8509-8929f56f89a4',
            kind: 'core:aggregate',
            version: '1.0.0',
            name: 'Aggregate'
        }
    ],
    edges: {
        Manual: {
            main: [
                {
                    node: 'Get Table of Contents',
                    port: 'main',
                    order: 0
                }
            ]
        },
        'Get Table of Contents': {
            main: [
                {
                    node: 'Split Out Items',
                    port: 'main',
                    order: 0
                }
            ]
        },
        'Split Out Items': {
            main: [
                {
                    node: 'Keep HTTP Services Only',
                    port: 'main',
                    order: 0
                }
            ]
        },
        'Keep HTTP Services Only': {
            main: [
                {
                    node: 'Map Operations',
                    port: 'main',
                    order: 0
                }
            ]
        },
        'Map Operations': {
            main: [
                {
                    node: 'Filter Operations With Errors',
                    port: 'main',
                    order: 0
                }
            ]
        },
        'Filter Operations With Errors': {
            main: [
                {
                    node: 'Services With Errors',
                    port: 'main',
                    order: 0
                },
                {
                    node: 'Mapped Services',
                    port: 'main',
                    order: 0
                }
            ]
        },
        'Mapped Services': {
            main: [
                {
                    node: 'Services',
                    port: 'main',
                    order: 0
                }
            ]
        },
        Services: {
            main: [
                {
                    node: 'Get Service Nodes',
                    port: 'main',
                    order: 0
                }
            ]
        },
        'Get Service Nodes': {
            main: [
                {
                    node: 'Get Bundled Spec',
                    port: 'main',
                    order: 0
                }
            ]
        },
        'Get Bundled Spec': {
            main: [
                {
                    node: 'Latest Known Spec',
                    port: 'main',
                    order: 0
                }
            ]
        },
        'Latest Known Spec': {
            main: [
                {
                    node: 'Is Known Service?',
                    port: 'main',
                    order: 0
                }
            ]
        },
        'Is Known Service?': {
            main: [
                {
                    node: 'Match Found, Check For Changes',
                    port: 'main',
                    order: 0
                },
                {
                    node: 'NocoDB',
                    port: 'main',
                    order: 0
                }
            ]
        },
        'Match Found, Check For Changes': {
            main: [
                {
                    node: 'Has Changes?',
                    port: 'main',
                    order: 0
                }
            ]
        },
        'Has Changes?': {
            main: [
                {
                    node: 'Aggregate',
                    port: 'main',
                    order: 0
                }
            ]
        },
        NocoDB: {
            main: [
                {
                    node: 'Aggregate',
                    port: 'main',
                    order: 0
                }
            ]
        }
    }
};
