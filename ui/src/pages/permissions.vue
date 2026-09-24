<template>
  <section class="py-8 px-6">
    <div class="max-w-5xl mx-auto bg-white rounded shadow p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold">
          Permissions
        </h2>
      </div>

      <form class="space-y-4"
        @submit.prevent="submitForm"
      >
        <!-- header row -->
        <div class="flex items-center border-b pb-3 mb-3 text-sm text-gray-600">
          <div class=""
            style="width:15%"
          >
            Key
          </div>
          <div class=""
            style="width:50%"
          >
            Page name
          </div>
          <div class=""
            style="width:10%"
          >
            Level
          </div>
          <div class="text-right"
            style="width:20%"
          >
            Actions
          </div>
        </div>

        <div v-if="pageLoading"
          class="py-6"
        >
          <loading />
        </div>

        <div class="mb-2" />

        <draggable v-model="permissions"
          :options="{ handle: '.parent-sort-handle', group: 'nav', ghostClass: 'opacity-50', animation: 150 }"
        >
          <template #item="{ element: permission, index }">
            <div class="w-full">
              <div class="flex items-start w-full border-b py-3">
                <!-- key -->
                <div class=""
                  style="width:15%"
                >
                  <input v-model="permission.key"
                    :disabled="permission.strict || !permission.new"
                    placeholder="key"
                    :class="['w-full px-2 py-1 border rounded text-sm', (permission.strict || !permission.new) ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : '']"
                  >
                </div>

                <!-- page name -->
                <div class=""
                  style="width:50%"
                >
                  <input v-model="permission.name"
                    :disabled="permission.strict"
                    placeholder="Name"
                    :class="['w-full px-2 py-1 border rounded text-sm', permission.strict ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : '']"
                  >
                </div>

                <!-- level -->
                <div class=""
                  style="width:10%"
                >
                  <select v-model="permission.level"
                    :disabled="permission.strict"
                    :class="['w-full px-2 py-1 border rounded text-sm', permission.strict ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : '']"
                  >
                    <option v-for="lvl in levels"
                      :key="lvl"
                      :value="lvl"
                    >
                      {{ lvl }}
                    </option>
                  </select>
                </div>

                <!-- actions -->
                <div class="flex items-center justify-end gap-3"
                  style="width:20%"
                >
                  <button v-if="!permission.strict"
                    type="button"
                    title="Make sub"
                    class="text-gray-600 hover:text-black"
                    @click="makeRowSub(index)"
                  >
                    ▶
                  </button>

                  <button v-if="!permission.strict"
                    type="button"
                    class="parent-sort-handle text-gray-600"
                    title="Drag handle"
                    @click.stop.prevent
                  >
                    ⠿
                  </button>

                  <button v-if="!permission.strict"
                    type="button"
                    class="text-red-600 hover:text-red-800"
                    title="Delete"
                    @click="removeRow(index)"
                  >
                    ✖
                  </button>
                </div>
              </div>

              <draggable v-model="permission.subCategories"
                :options="{ handle: '.sub-sort-handle', group: 'sub-nav', animation: 120 }"
                class="pl-8 w-full"
              >
                <template #item="{ element: subpermission, index: subindex }">
                  <div class="flex items-start w-full border-b py-2">
                    <div class=""
                      style="width:5%"
                    >
                      <span class="text-gray-400">↳</span>
                    </div>

                    <div class=""
                      style="width:15%"
                    >
                      <input v-model="subpermission.key"
                        :disabled="subpermission.strict || !subpermission.new"
                        placeholder="key"
                        :class="['w-full px-2 py-1 border rounded text-sm', (subpermission.strict || !subpermission.new) ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : '']"
                      >
                    </div>

                    <div class=""
                      style="width:50%"
                    >
                      <input v-model="subpermission.name"
                        :disabled="subpermission.strict"
                        placeholder="Name"
                        :class="['w-full px-2 py-1 border rounded text-sm', subpermission.strict ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : '']"
                      >
                    </div>

                    <div class=""
                      style="width:10%"
                    >
                      <select v-model="subpermission.level"
                        :disabled="subpermission.strict"
                        :class="['w-full px-2 py-1 border rounded text-sm', subpermission.strict ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : '']"
                      >
                        <option v-for="lvl in levels"
                          :key="lvl"
                          :value="lvl"
                        >
                          {{ lvl }}
                        </option>
                      </select>
                    </div>

                    <div class="flex items-center justify-end gap-3"
                      style="width:20%"
                    >
                      <button v-if="!subpermission.strict"
                        type="button"
                        title="Make parent"
                        class="text-gray-600 hover:text-black"
                        @click="makeRowParent(index, subindex)"
                      >
                        ◀
                      </button>

                      <button v-if="!subpermission.strict"
                        type="button"
                        class="sub-sort-handle text-gray-600"
                        title="Drag handle"
                        @click.stop.prevent
                      >
                        ⠿
                      </button>

                      <button v-if="!subpermission.strict"
                        type="button"
                        class="text-red-600 hover:text-red-800"
                        @click="removeSubRow(index, subindex)"
                      >
                        ✖
                      </button>
                    </div>
                  </div>
                </template>
              </draggable>
            </div>
          </template>
        </draggable>

        <div class="flex justify-center mt-4">
          <button type="button"
            :disabled="formLoading"
            class="px-3 py-1 bg-green-600 text-white rounded"
            @click="addRow"
          >
            +
          </button>
        </div>

        <div class="flex justify-end mt-4">
          <button type="submit"
            :disabled="formLoading"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Save
          </button>
        </div>

      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
// 3rd party libs
import { ref, reactive, onMounted } from 'vue';
import draggable from 'vuedraggable-es';

// Inc
import { routes, maxLevel } from '@src/inc/config';

// Components
import loading from '@src/components/loading.vue';
import { apiFetchPermissions, apiPutPermissions } from '@src/inc/api';

// Interfaces
import { PermissionInterface } from '@shared/interfaces/permissions';

const permissions = ref<PermissionInterface[]>([]);
const formLoading = ref(false);
const pageLoading = ref(true);
const errorClasses = reactive<any>({});
const levels = ref<number[]>([]);

function setUpLevels() {
  const arr: number[] = [];

  for (let i = 1; i <= maxLevel.value; ++i) arr.push(i);

  return arr;
}

onMounted(async () => {
  levels.value = setUpLevels();
  await fetchData();
});

async function fetchData() {
  permissions.value = await apiFetchPermissions();
  addEmptySubCategories();
  pageLoading.value = false;
}

async function submitForm() {
  formLoading.value = true;

  // Reset errors
  Object.keys(errorClasses).forEach(k => delete errorClasses[k]);

  // On submit, remove "new" parameter from all
  for (const item of permissions.value) {
    if (item.new && item.key && item.name) {
      delete item.new;
    }

    for (const subitem of (item.subCategories || [])) {
      if (subitem.new && subitem.key && subitem.name) {
        delete subitem.new;
      }
    }
  }

  const response = await apiPutPermissions(permissions.value);

  if (!response.status) {
    console.error(response?.message || response);
    // this.displayMessage / this.formMixinHandleErrors need to be implemented or reconnected later
  }

  formLoading.value = false;
}

function addRow() {
  permissions.value.push({
    key: '',
    name: '',
    strict: false,
    level: 1,
    new: true,
    subCategories: []
  });
}

function removeRow(index: number) {
  if (!confirm('Are you sure to delete?')) return;
  permissions.value.splice(index, 1);
}

function makeRowSub(index: number) {
  if (!permissions.value[index] || permissions.value[index].subCategories?.length) {
    console.warn('Cannot make row sub if it has subcategories');

    return;
  }

  if (!permissions.value[index - 1]) return;

  if (!permissions.value[index - 1].subCategories) permissions.value[index - 1].subCategories = [];

  permissions.value[index - 1].subCategories.push(permissions.value[index]);
  permissions.value.splice(index, 1);
}

function makeRowParent(index: number, subindex: number) {
  const row = permissions.value[index].subCategories[subindex];

  permissions.value[index].subCategories.splice(subindex, 1);
  permissions.value.splice(index + 1, 0, row);
}

function removeSubRow(index: number, subindex: number) {
  if (!confirm('Are you sure to delete?')) return;
  permissions.value[index].subCategories.splice(subindex, 1);
}

function addEmptySubCategories() {
  for (let i = 0; i < permissions.value.length; ++i) {
    if (!permissions.value[i].subCategories) permissions.value[i].subCategories = [];
  }
}
</script>

<script lang="ts">
routes.push({
  path: '/permissions',
  component: () => import('./permissions.vue'),
  meta: {
    title: 'Permissions'
  }
});
</script>